import Modal from '../shared/Modal';

const UpdateAccountModal = ({
    showUpdateUserConfirmModal,
    setShowUpdateUserConfirmModal,
    handleUpdateUser
}) => {
    return (
        <Modal
            isOpen={showUpdateUserConfirmModal}
            onClose={() => setShowUpdateUserConfirmModal(false)}
            onConfirm={handleUpdateUser}
        >
            <Modal.Header>
                <Modal.Header.Title>
                    <p className="text-warning">Caution!</p>
                </Modal.Header.Title>
                <Modal.Header.CloseButton />
            </Modal.Header>
            <Modal.Body>
                <p className="ml-5 mb-4">
                    Your account will be updated. You&apos;ll have to login
                    again. Wish to continue?
                </p>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-center">
                <Modal.Footer.ConfirmButton className="btn btn-warning">
                    Update Account
                </Modal.Footer.ConfirmButton>
                <Modal.Footer.CancelButton>Cancel</Modal.Footer.CancelButton>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateAccountModal;
