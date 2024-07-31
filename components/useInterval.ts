import { useEffect, useRef } from 'react';

type CallbackType = () => unknown;

export function useInterval(callback: CallbackType, delay: number | null) {
    const savedCallback = useRef<CallbackType>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        function tick() {
            savedCallback.current!();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}