import re
import cv2
import numpy as np
import pytesseract
import requests
import os
import json
from io import BytesIO
from PIL import Image
from bs4 import BeautifulSoup

# this file is a little gross, partially because the old website was too

script_dir = os.path.dirname(os.path.abspath(__file__))

output_folder = os.path.join(script_dir, 'output')
data_folder = os.path.join(script_dir, 'data')

sold_grid_start = "{.sqs-gallery-container .sqs-gallery-block-grid .sqs-gallery-aspect-ratio-square .sqs-gallery-thumbnails-per-row-4 .sqs-gallery-block-show-meta .block-animation-none .clear}"
sold_grid_stop = "sqs-block-content"
sold_image_regex = r'!\[.*?\]\((.*?)\)'            # regex to match Markdown image links
cardinal_address_regex = r'^([0-9]+ [NESW])\. (.+)'


isDevelopedBySoldSection = [
    True, False, False, False, False
]

sold_prefix = 'sold'

sold_markdown = os.path.join(data_folder, 'sold.md')
selected_work = {
    '1101 S Gilpin': '1101-S-Gilpin.html',
    '1111 S Gilpin': '1111-S-Gilpin.html',
    '1005 S Gilpin': '1005-S-Gilpin.html',
    '525 S Vine': '525-S-Vine.html',
    '1 Sterling Ave': '1-Sterling.html',
    '315 Fairfax': '315-Fairfax.html',
    '1165 S Vine': '1165-Vine-Street.html',
    '445 S Williams': '445-S-Williams.html',
    '890 S St Paul': '890-S-St-Paul.html',
}

starts_with_corrections = {
    '1026 S$. High Street': '1026 S High Street',
}
st_paul_regex = r'(\d+) S (Saint Paul Street|South Saint Paul|St Paul Street)'
st_paul_replace = r'\1 S St Paul'
image_id = 0

selected_work_prefix='selected_work'
min_size = 250
white_threshold = 250

def download_image(url):
    response = requests.get(url)
    image_pil = Image.open(BytesIO(response.content))

    if image_pil.mode != 'RGBA':
        image_pil = image_pil.convert('RGBA')

    img = np.array(image_pil)
    return cv2.cvtColor(img, cv2.COLOR_RGB2BGRA)

def save_image(image, prefix):
    global image_id

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    image_name = f'{prefix}_image_{image_id}.png'
    image_id += 1
    image_path = os.path.join(output_folder, image_name)
    cv2.imwrite(image_path, image)
    return image_name
# SOLD

def extract_sold_sections(markdown_content):
    # Split the markdown content into grid sections
    sections = []
    in_grid = False
    current_section = []
    
    for line in markdown_content.splitlines():
        if sold_grid_start in line:
            in_grid = True
            current_section = []
        if in_grid:
            current_section.append(line)
        if sold_grid_stop in line and in_grid:
            in_grid = False
            sections.append("\n".join(current_section))
    
    return sections

def markdown_to_sold_sections(file_path):
    # Read the Markdown file
    with open(file_path, 'r') as file:
        markdown_content = file.read()
    
    # Extract grid sections
    grid_sections = extract_sold_sections(markdown_content)
    
    # Extract image links from each grid section
    all_image_links = [re.findall(sold_image_regex, section, re.DOTALL) for section in grid_sections]
    
    return all_image_links

def find_white_line(image, threshold=0.95):
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    height = gray.shape[0]
    
    # Iterate through rows in the bottom half to find the almost white line
    for y in range(height // 2, height):
        white_pixel_count = np.sum(gray[y, :] > 240)  # Count almost white pixels
        white_pixel_ratio = white_pixel_count / gray.shape[1]
        if white_pixel_ratio > threshold:
            return y
    return None

def remove_top_almost_white_lines(image, threshold=0.95):
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Iterate through rows from the top to find the first non-almost white line
    for y in range(gray.shape[0]):
        white_pixel_count = np.sum(gray[y, :] > 240)  # Count almost white pixels
        white_pixel_ratio = white_pixel_count / gray.shape[1]
        if white_pixel_ratio < threshold:
            return image[y:, :]
    return image

def split_sold_image(image):
    split_line = find_white_line(image)
    if split_line is None:
        return image, None
    
    # Split the image at the detected line
    house_part = image[:split_line, :]
    text_part = image[split_line:, :]
    
    # Remove almost white lines from the top of house_part
    house_part = remove_top_almost_white_lines(house_part)
    
    return house_part, text_part

def correct_address(address):
    for key, value in starts_with_corrections.items():
        if address.startswith(key):
            return value
    return re.sub(st_paul_regex, st_paul_replace, address)

def format_address(address):
    formatted_address = re.sub(cardinal_address_regex, r'\1 \2', address.strip().lower().title())
    return correct_address(formatted_address)

def extract_text_from_sold_image(image):
    if image is None:
        return ""
    
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Use pytesseract to do OCR on the image
    address = pytesseract.image_to_string(gray)
    
    return format_address(address)

def process_sold_images(image_urls):
    global image_id
    results = []
    for image_url in image_urls:
        image = download_image(image_url)
        house_part, text_part = split_sold_image(image)
        text_extracted = extract_text_from_sold_image(text_part)

                # Check if house_part is empty
        if house_part is None or house_part.size == 0:
            print(f"House part is empty for URL: {image_url}")
            continue
    
        if not re.match(r'^\d+ .*', text_extracted):
            print(f"Text format validation failed for URL: {image_url}")
            continue
        
        house_image_name = save_image(house_part, sold_prefix)

        results.append((house_image_name, text_part, text_extracted))
    print(f"Extracted {len(results)} houses from {len(image_urls)} images")
    return results

def create_sold_objects(processed_sections):
    objects = []

    for section, isDeveloped in zip(processed_sections, isDevelopedBySoldSection):
        for (house_image_name, _, text_extracted) in section:
            # Construct the object
            obj = {
                "mainImage": house_image_name,
                "address": text_extracted,
                "isDeveloped": isDeveloped,
                "isSelectedWork": False,
                "isForSale": False,
                "images": [],
            }
            
            objects.append(obj)
    
    return objects

# SELECTED WORK

def get_html_content(html_file_name):
    html_file = os.path.join(data_folder, html_file_name)
    with open(html_file, 'r') as file:
        html_content = file.read()
    return html_content

def selected_work_image_urls(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    image_divs = soup.find_all('div', class_='slide content-fill')
    image_links = [div.find('img', class_='thumb-image')['data-src'] for div in image_divs]
    return image_links

def get_valid_sub_images(image, contours):
    extracted_images = []
    for contour in contours:
        # Get bounding box
        x, y, w, h = cv2.boundingRect(contour)
        
        # Extract the region of interest (ROI)
        roi = image[y:y+h, x:x+w]
        
        # Only consider significant areas to avoid noise
        if w > min_size and h > min_size:  # You may need to adjust these values
            extracted_images.append(roi)

    return extracted_images

def split_selected_work_image(url):
    def split_transparent(image):
        b, g, r, a = cv2.split(image)

        # Threshold the alpha channel to create a binary mask for transparency
        _, alpha_mask = cv2.threshold(a, 0, 255, cv2.THRESH_BINARY)

        # Find contours for transparent areas
        contours, _ = cv2.findContours(alpha_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        return get_valid_sub_images(image, contours)

    def split_white(image):
            # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply a binary threshold to the image
        _, binary = cv2.threshold(gray, white_threshold, 255, cv2.THRESH_BINARY_INV)
        
        # Find contours
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        return get_valid_sub_images(image, contours)

    image = download_image(url)
    transparent_splits = split_transparent(image)
    white_splits = []

    for transparent_split in transparent_splits:
        white_splits.extend(split_white(transparent_split))

    return [save_image(selected_work_image, selected_work_prefix) for selected_work_image in white_splits]

def selected_work_images(address_dict):
    def sub_images_from_html_file(html_file):
        html_content = get_html_content(html_file)
        image_links = selected_work_image_urls(html_content)
        sub_images = []
        for image_link in image_links:
            sub_images.extend(split_selected_work_image(image_link))
        print(f"Extracted {len(sub_images)} images from {html_file}")
        return sub_images
    
    return {
        address: sub_images_from_html_file(html_file) for address, html_file in address_dict.items()
    }

def create_selected_work_objects(address_images):
    objects = []
    for address, images in address_images.items():
        obj = {
            "images": images,
            "address": address,
        }

        objects.append(obj)
    
    return objects

def standardize_address(address):
    return re.sub(r'\s+', '_', format_address(address))

def merge_objects(sold, selected_work):
    all_objects = sold.copy()
    for select in selected_work:
        found = False

        for obj in all_objects:
            if standardize_address(obj["address"]) == standardize_address(select["address"]):
                obj['images'] = select['images']
                obj['isSelectedWork'] = True
                found = True
                break

        if not found:
            print(f"Address {select['address']} not found in sold data")

    return all_objects

sold_sections = markdown_to_sold_sections(sold_markdown)
processed_sections = [process_sold_images(links) for links in sold_sections]
sold_objects = create_sold_objects(processed_sections)

address_images = selected_work_images(selected_work)
selected_work_objects = create_selected_work_objects(address_images)

all_objects = merge_objects(sold_objects, selected_work_objects)

json_path = os.path.join(output_folder, f"data.json")
with open(json_path, 'w') as json_file:
    json.dump(all_objects, json_file, indent=4)


