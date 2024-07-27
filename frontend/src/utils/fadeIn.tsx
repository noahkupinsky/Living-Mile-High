import { useState, useEffect } from 'react';
import { requestAnimationFrames } from './misc';

const useFadeIn = () => {
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        requestAnimationFrames(() => {
            setOpacity(1);
        });
    }, []);

    return opacity;
};

export default useFadeIn;