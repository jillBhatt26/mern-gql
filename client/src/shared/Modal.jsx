import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef
} from 'react';
import { createPortal } from 'react-dom';
import useOutClickNotifier from '../hooks/useOutClickNotifier';

const ModalContext = createContext();

const Modal = ({ isOpen, onClose, onConfirm, children, ...props }) => {
    // refs
    const modalRef = useRef();

    // hooks
    const hasClickedOutside = useOutClickNotifier(modalRef);

    // callbacks
    const keyDownHandlerCB = useCallback(
        e => {
            if (e.keyCode === 27) {
                e.preventDefault();

                onClose();
            }

            if (e.keyCode === 9) {
                if (!modalRef || !modalRef.current) return;

                e.preventDefault();

                const focusableElementsOfModal = Array.from(
                    modalRef.current.querySelectorAll('button[type="button"]')
                );

                if (!focusableElementsOfModal.length) return;

                const focussedElementIdx = focusableElementsOfModal.findIndex(
                    element => element === document.activeElement
                );

                let newFocusIndex = focussedElementIdx + 1;

                if (newFocusIndex > focusableElementsOfModal.length - 1)
                    newFocusIndex = 0;

                focusableElementsOfModal[newFocusIndex].focus({
                    focusVisible: true
                });
            }
        },
        [onClose]
    );

    const handleKeyDownCB = useCallback(() => {
        document.addEventListener('keydown', keyDownHandlerCB);

        return () => document.removeEventListener('keydown', keyDownHandlerCB);
    }, [keyDownHandlerCB]);

    // effects
    useEffect(() => {
        handleKeyDownCB();
    }, [handleKeyDownCB]);

    useEffect(() => {
        if (hasClickedOutside) onClose();
    }, [hasClickedOutside, onClose]);

    return createPortal(
        <>
            {isOpen && (
                <div
                    className="dialog-overlay"
                    role="dialog"
                    aria-modal="true"
                    {...props}
                >
                    <div
                        className="dialog-container bg-primary my-auto"
                        ref={modalRef}
                        style={{ maxHeight: '90vh', overflow: 'auto' }}
                    >
                        <ModalContext.Provider value={{ onClose, onConfirm }}>
                            {children}
                        </ModalContext.Provider>
                    </div>
                </div>
            )}
        </>,
        document.body
    );
};

Modal.Header = function ModalHeader({ children, className, ...props }) {
    return (
        <div
            className={`modal-header d-flex justify-content-between align-middle ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

Modal.Header.Title = function ModalHeaderTitle({
    children,
    className,
    ...props
}) {
    return (
        <h3 className={`modal-title ${className}`} {...props}>
            {children}
        </h3>
    );
};

Modal.Header.CloseButton = function ModalHeaderCloseButton({
    children,
    className,
    ...props
}) {
    const { onClose } = useContext(ModalContext);

    return (
        <button
            type="button"
            className={`btn-close ${className}`}
            style={{ marginTop: `-1.5rem` }}
            onClick={onClose}
            {...props}
        >
            <span aria-hidden="true">{children}</span>
        </button>
    );
};

Modal.Body = function ModalBody({ children, className, ...props }) {
    return (
        <div className={`modal-body ${className}`} {...props}>
            {children}
        </div>
    );
};

Modal.Footer = function ModalFooter({ children, className, ...props }) {
    return (
        <div className={`modal-footer gap-3 ${className}`} {...props}>
            {children}
        </div>
    );
};

Modal.Footer.ConfirmButton = function ModalFooterConfirmButton({
    children,
    className,
    ...props
}) {
    const { onConfirm } = useContext(ModalContext);

    return (
        <button
            className={`btn btn-primary ${className}`}
            onClick={onConfirm}
            type="button"
            {...props}
        >
            {children}
        </button>
    );
};

Modal.Footer.CancelButton = function ModalFooterCancelButton({
    children,
    className,
    ...props
}) {
    const { onClose } = useContext(ModalContext);

    return (
        <button
            className={`btn btn-secondary ${className}`}
            type="button"
            onClick={onClose}
            {...props}
        >
            {children}
        </button>
    );
};

export default Modal;
