import { useEffect, useState } from 'react';
import { ApolloProvider, useMutation } from '@apollo/client';
import { uploadClient } from '../config/apollo';
import Modal from '../shared/Modal';
import Image from '../shared/Image';
import { UPLOAD_IMAGE } from '../services/mutation/Image';
import useImagesStore from '../stores/images';

const AddImageFormModal = ({
    showAddImageFormModal,
    setShowAddImageFormModal
}) => {
    // states
    const [imageToUpload, setImageToUpload] = useState(null);
    const [renderImageURL, setRenderImageURL] = useState(null);
    const [disableAddImageButton, setDisableAddImageButton] = useState(true);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [uploadImageError, setUploadImageError] = useState(null);

    // hooks
    const pushNewImage = useImagesStore(state => state.pushNewImage);
    const [uploadImage, { loading }] = useMutation(UPLOAD_IMAGE, {
        onCompleted: data => {
            if (data.UploadImage) {
                pushNewImage(data.UploadImage);
                handleAddImageModalClose();
            }
        },
        onError: error => {
            if (error) {
                const errorMessage = error.toString().split(':').pop();

                setUploadImageError(errorMessage);
            }
        },
        context: {
            headers: {
                'apollo-require-preflight': true
            }
        }
    });

    // effects
    useEffect(() => {
        if (!imageToUpload) return;

        setRenderImageURL(URL.createObjectURL(imageToUpload));
    }, [imageToUpload]);

    useEffect(() => {
        setIsUploadingImage(loading);
    }, [loading]);

    useEffect(() => {
        setDisableAddImageButton(
            isUploadingImage ||
                imageToUpload === null ||
                renderImageURL === null
        );
    }, [imageToUpload, renderImageURL, isUploadingImage]);

    // event handlers

    const handleAddImageModalClose = () => {
        setImageToUpload(null);
        setRenderImageURL(null);
        setShowAddImageFormModal(false);
        setDisableAddImageButton(false);
    };

    const handleUploadImage = () => {
        uploadImage({
            variables: {
                image: imageToUpload
            }
        });
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
                // onSubmit={handleAddImageFormSubmit}
            >
                <Modal.Header>
                    <Modal.Header.Title className="text-success">
                        Add new image
                    </Modal.Header.Title>
                    <Modal.Header.CloseButton />
                </Modal.Header>

                <Modal.Body className="mt-1 mb-4">
                    {renderImageURL && !uploadImageError && (
                        <Image src={renderImageURL} />
                    )}

                    {uploadImageError && (
                        <div className="alert alert-dismissible alert-danger mt-5">
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setUploadImageError(null)}
                            ></button>

                            {uploadImageError}
                        </div>
                    )}

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
                        onClick={handleUploadImage}
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

const AddImageModal = ({ showAddImageFormModal, setShowAddImageFormModal }) => (
    <ApolloProvider client={uploadClient}>
        <AddImageFormModal
            showAddImageFormModal={showAddImageFormModal}
            setShowAddImageFormModal={setShowAddImageFormModal}
        />
    </ApolloProvider>
);

export default AddImageModal;
