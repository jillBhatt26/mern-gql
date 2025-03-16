import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef
} from 'react';
import { createPortal } from 'react-dom';

const ModalContext = createContext();

const Modal = ({ isOpen, onClose, onConfirm, children, ...props }) => {
    // refs
    const modalRef = useRef();

    // callbacks
    const keyDownHandlerCB = useCallback(
        e => {
            if (e.keyCode !== 27) return;

            e.preventDefault();

            onClose();
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

    return createPortal(
        <>
            {isOpen && (
                <div className="dialog-overlay" {...props}>
                    <div className="dialog-container bg-primary" ref={modalRef}>
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
        <div
            className={`btn btn-primary ${className}`}
            onClick={onConfirm}
            {...props}
        >
            {children}
        </div>
    );
};

Modal.Footer.CancelButton = function ModalFooterCancelButton({
    children,
    className,
    ...props
}) {
    const { onClose } = useContext(ModalContext);

    return (
        <div
            className={`btn btn-secondary ${className}`}
            onClick={onClose}
            {...props}
        >
            {children}
        </div>
    );
};

export default Modal;
