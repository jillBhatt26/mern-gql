import { useEffect, useState } from 'react';
import Modal from '../shared/Modal';
import Image from '../shared/Image';

const AddImageFormModal = ({
    showAddImageFormModal,
    setShowAddImageFormModal
}) => {
    // states
    const [imageToUpload, setImageToUpload] = useState(null);
    const [renderImageURL, setRenderImageURL] = useState(null);
    const [disableAddImageButton, setDisableAddImageButton] = useState(true);

    // effects
    useEffect(() => {
        if (!imageToUpload) return;

        setRenderImageURL(URL.createObjectURL(imageToUpload));
    }, [imageToUpload]);

    useEffect(() => {
        setDisableAddImageButton(
            imageToUpload === null || renderImageURL === null
        );
    }, [imageToUpload, renderImageURL]);

    // event handlers

    const handleAddImageModalClose = () => {
        setImageToUpload(null);
        setRenderImageURL(null);
        setShowAddImageFormModal(false);
        setDisableAddImageButton(false);
    };

    const handleAddImageFormSubmit = e => {
        e.preventDefault();

        handleAddImageModalClose();
    };

    return (
        <Modal
            isOpen={showAddImageFormModal}
            onClose={handleAddImageModalClose}
            onConfirm={handleAddImageModalClose}
        >
            <form
                noValidate
                autoComplete="off"
                onSubmit={handleAddImageFormSubmit}
            >
                <Modal.Header>
                    <Modal.Header.Title className="text-success">
                        Add new image
                    </Modal.Header.Title>
                    <Modal.Header.CloseButton />
                </Modal.Header>

                <Modal.Body className="mt-1 mb-4">
                    {renderImageURL && <Image src={renderImageURL} />}

                    <div>
                        <label htmlFor="formFile" className="form-label mt-4">
                            Upload new image
                        </label>
                        <input
                            className="form-control"
                            type="file"
                            id="formFile"
                            accept="image/*"
                            multiple={false}
                            onChange={e => setImageToUpload(e.target.files[0])}
                        />
                    </div>
                </Modal.Body>

                <Modal.Footer className="d-flex justify-center">
                    <Modal.Footer.ConfirmButton
                        className="btn btn-success"
                        disabled={disableAddImageButton}
                    >
                        Add image
                    </Modal.Footer.ConfirmButton>
                    <Modal.Footer.CancelButton>
                        Cancel
                    </Modal.Footer.CancelButton>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default AddImageFormModal;
