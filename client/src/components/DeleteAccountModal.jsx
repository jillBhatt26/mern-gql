import Modal from '../shared/Modal';

const DeleteAccountModal = ({
    showDeleteUserConfirmModal,
    setShowDeleteUserConfirmModal,
    handleDeleteUser
}) => {
    return (
        <Modal
            isOpen={showDeleteUserConfirmModal}
            onClose={() => setShowDeleteUserConfirmModal(false)}
            onConfirm={handleDeleteUser}
        >
            <Modal.Header>
                <Modal.Header.Title>
                    <p className="text-danger">Caution!</p>
                </Modal.Header.Title>
                <Modal.Header.CloseButton />
            </Modal.Header>
            <Modal.Body>
                <p className="ml-5 mb-4">
                    This action is irreversible. Your account and all your data
                    will be permanently deleted. Wish to continue?
                </p>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-center">
                <Modal.Footer.ConfirmButton className="btn btn-danger">
                    Delete Account
                </Modal.Footer.ConfirmButton>
                <Modal.Footer.CancelButton>Cancel</Modal.Footer.CancelButton>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteAccountModal;
