import React, { useEffect, useState, useRef } from 'react';

type KeySequenceListenerProps = {
    onSequence: () => void;
    sequence: string[];
    timeout?: number;
}

const KeySequenceListener: React.FC<KeySequenceListenerProps> = ({ onSequence, sequence, timeout = 1000 }) => {
    const [inputSequence, setInputSequence] = useState<string[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            setInputSequence((prevSequence) => {
                const newSequence = [...prevSequence, event.key].slice(-sequence.length);
                if (newSequence.join(' ') === sequence.join(' ')) {
                    onSequence();
                    return [];
                }
                return newSequence;
            });
            timerRef.current = setTimeout(() => setInputSequence([]), timeout);
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [sequence, onSequence, timeout]);

    return null;
};


export default KeySequenceListener;