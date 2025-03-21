import Modal from '../shared/Modal';

const ConfirmDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    message,
    confirmButtonLabel,
    error = null
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} onConfirm={onConfirm}>
            <Modal.Header>
                <Modal.Header.Title>
                    <p className="text-danger">Caution!</p>
                </Modal.Header.Title>
                <Modal.Header.CloseButton />
            </Modal.Header>
            <Modal.Body>
                {error ? (
                    <div className="alert alert-dismissible alert-danger mt-5">
                        {error}
                    </div>
                ) : (
                    <p className="ml-5 mb-4">{message}</p>
                )}
            </Modal.Body>
            <Modal.Footer className="d-flex justify-center">
                <Modal.Footer.ConfirmButton className="btn btn-danger">
                    {confirmButtonLabel}
                </Modal.Footer.ConfirmButton>
                <Modal.Footer.CancelButton>Cancel</Modal.Footer.CancelButton>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmDeleteModal;
