import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { View, Button, styled } from 'tamagui';
import AspectImage from './AspectImage';
import { ImageFormat } from '@/types';
import { imageFormatToUrl } from '@/utils/misc';

const DraggableImageContainer = styled(View, {
    position: 'relative',
    border: '1px solid #ccc',
});

const DeleteButton = styled(Button, {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.5)', // Translucent red
    color: '#fff',
    borderRadius: 10, // Make it round
    border: 'none', // Remove default border
});

type DraggableImageProps = {
    url: string;
    index: number;
    moveImage: (dragIndex: number, hoverIndex: number) => void;
    deleteImage: (index: number) => void;
    width?: number;
    height?: number;
};

const DraggableImage: React.FC<DraggableImageProps> = ({ url, index, moveImage, deleteImage, width, height }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const [{ handlerId }, drop] = useDrop({
        accept: 'image',
        collect: (monitor) => ({
            handlerId: monitor.getHandlerId(),
        }),
        hover: (item: any, monitor) => {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveImage(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag, preview] = useDrag({
        type: 'image',
        item: () => {
            return { index, height: ref.current?.offsetHeight, width: ref.current?.offsetWidth };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0.5 : 1;
    drag(drop(ref));

    React.useEffect(() => {
        if (ref.current) {
            preview(ref.current, { captureDraggingState: true });
        }
    }, [preview]);

    return (
        <DraggableImageContainer ref={ref} style={{ opacity, width, height }}>
            <AspectImage
                src={url}
                alt={`House image ${url}`}
                width={width}
                height={height}
            />
            <DeleteButton onPress={() => deleteImage(index)}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M 2.75 2.042969 L 2.042969 2.75 L 2.398438 3.101563 L 7.292969 8 L 2.042969 13.25 L 2.75 13.957031 L 8 8.707031 L 12.894531 13.605469 L 13.25 13.957031 L 13.957031 13.25 L 13.605469 12.894531 L 8.707031 8 L 13.957031 2.75 L 13.25 2.042969 L 8 7.292969 L 3.101563 2.398438 Z"></path>
                </svg>
            </DeleteButton>
        </DraggableImageContainer>
    );
};

export default DraggableImage;