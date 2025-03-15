import { Dialog } from '@headlessui/react';

const Modal = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} as="div">
            <div className="dialog-overlay">
                <div className="dialog-container">
                    <div className="modal-header d-flex justify-content-between">
                        <h3 className="modal-title">Dialog Title</h3>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        >
                            <span aria-hidden="true"></span>
                        </button>
                    </div>
                    <div className="modal-body py-1">Modal body</div>
                    <div className="modal-footer gap-3">
                        <button className="btn btn-primary">Confirm</button>
                        <button className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default Modal;
