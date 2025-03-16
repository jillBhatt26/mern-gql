import { useCallback, useEffect, useState } from 'react';

const useOutClickNotifier = ref => {
    const [hasClickedOutside, setHasClickedOutside] = useState(false);

    // callbacks
    const checkOutsideClickCB = useCallback(
        e => {
            if (!ref.current) return setHasClickedOutside(false);

            return setHasClickedOutside(
                ref.current && !ref.current.contains(e.target)
            );
        },
        [ref]
    );

    const handleMouseDownCB = useCallback(() => {
        document.addEventListener('mousedown', checkOutsideClickCB);

        return () =>
            document.removeEventListener('mousedown', checkOutsideClickCB);
    }, [checkOutsideClickCB]);

    // useEffects
    useEffect(() => {
        handleMouseDownCB();
    }, [handleMouseDownCB]);

    return hasClickedOutside;
};

export default useOutClickNotifier;
