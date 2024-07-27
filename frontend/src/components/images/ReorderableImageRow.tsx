import React from 'react';
import { View, styled } from 'tamagui';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import DraggableImage from './DraggableImage';

const ImageList = styled(View, {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
});

type ReorderableImageRowProps = {
    images: string[];
    setImages: React.Dispatch<React.SetStateAction<string[]>>;
};

const ReorderableImageRow: React.FC<ReorderableImageRowProps> = ({ images, setImages }) => {
    const moveImage = (dragIndex: number, hoverIndex: number) => {
        const updatedImages = [...images];
        const [draggedImage] = updatedImages.splice(dragIndex, 1);
        updatedImages.splice(hoverIndex, 0, draggedImage);
        setImages(updatedImages);
    };

    const deleteImage = (index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <ImageList>
                {images.map((url, index) => (
                    <DraggableImage
                        key={index}
                        index={index}
                        url={url}
                        moveImage={moveImage}
                        deleteImage={deleteImage}
                        width={100}
                    />
                ))}
            </ImageList>
        </DndProvider>
    );
};

export default ReorderableImageRow;