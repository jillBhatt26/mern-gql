import { useMutation, useQuery } from '@apollo/client';
import { lazy, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Nav from '../shared/Nav';
import Footer from '../shared/Footer';
import Image from '../shared/Image';
import { FETCH_USER_IMAGE, FETCH_USER_IMAGES } from '../services/query/Image';
import { DELETE_IMAGE } from '../services/mutation/Image';
import useImagesStore from '../stores/images';
const LoadingPage = lazy(() => import('./Loading'));

const ViewPage = () => {
    // states
    const [imageError, setImageError] = useState(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(-1);
    const [previousImageID, setPreviousImageID] = useState(null);
    const [nextImageID, setNextImageID] = useState(null);
    const [showDeleteImageConfirmModal, setShowDeleteImageConfirmModal] =
        useState(false);

    // hooks
    const userImages = useImagesStore(state => state.userImages);
    const removeUserImage = useImagesStore(state => state.removeUserImage);
    const params = useParams();
    const navigate = useNavigate();
    const {
        data,
        error: fetchError,
        loading: fetchLoading
    } = useQuery(FETCH_USER_IMAGE, {
        variables: {
            id: params.id
        }
    });
    const [deleteImage, { loading: deleteLoading }] = useMutation(
        DELETE_IMAGE,
        {
            variables: {
                id: params.id
            },
            onCompleted: data => {
                if (data.DeleteImage) {
                    removeUserImage(params.id);

                    return navigate('/gallery');
                }
            },
            onError: error => {
                const errorMessage = error.toString().split(':').pop();

                setImageError(errorMessage);
            },
            update: (cache, results) => {
                if (results.data.DeleteImage) {
                    const { FetchUserImagesQuery } = cache.readQuery({
                        query: FETCH_USER_IMAGES
                    });

                    const existingImages = FetchUserImagesQuery.filter(
                        img => img._id !== params.id
                    );

                    cache.writeQuery({
                        query: FETCH_USER_IMAGES,
                        data: {
                            FetchUserImagesQuery: existingImages
                        }
                    });
                }
            }
        }
    );

    // effects
    useEffect(() => {
        if (fetchError) {
            const errorMessage = fetchError.toString().split(':').pop();

            setImageError(errorMessage);
        }
    }, [fetchError]);

    useEffect(() => {
        setCurrentImageIndex(
            userImages.findIndex(img => img._id === params.id)
        );
    }, [params.id, userImages]);

    useEffect(() => {
        if (currentImageIndex <= 0) return setPreviousImageID(null);

        setPreviousImageID(userImages[currentImageIndex - 1]._id);
    }, [currentImageIndex, userImages]);

    useEffect(() => {
        if (currentImageIndex >= userImages.length - 1)
            return setNextImageID(null);

        setNextImageID(userImages[currentImageIndex + 1]._id);
    }, [currentImageIndex, userImages]);

    // event handlers
    const handleShowPreviousImage = () => {
        if (previousImageID === null) return;

        return navigate(`/view/${previousImageID}`);
    };

    const handleShowNextImage = () => {
        if (nextImageID === null) return;

        return navigate(`/view/${nextImageID}`);
    };

    if (fetchLoading || deleteLoading) return <LoadingPage />;

    return (
        <>
            <Nav />

            <div className="container mt-5">
                {imageError && (
                    <div className="alert alert-dismissible alert-danger mt-5">
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setImageError(null)}
                        ></button>

                        {imageError}
                    </div>
                )}

                {/* Image */}
                <div className="col-sm-12 col-md-10 mx-auto d-flex justify-content-center">
                    {data && (
                        <Image
                            src={data.FetchUserImage.url}
                            alt={data.FetchUserImage.cloudImageName}
                            onLoad={() => setIsImageLoaded(true)}
                        />
                    )}
                </div>

                {isImageLoaded && (
                    <div className="d-flex flex-column flex-md-row justify-content-center mt-5 gap-3">
                        <button
                            className="btn btn-warning"
                            onClick={() => navigate('/gallery')}
                        >
                            Gallery
                        </button>
                        <button
                            className="btn btn-info"
                            disabled={currentImageIndex <= 0}
                            onClick={handleShowPreviousImage}
                        >
                            Previous
                        </button>
                        <button
                            className="btn btn-info"
                            disabled={
                                currentImageIndex >= userImages.length - 1
                            }
                            onClick={handleShowNextImage}
                        >
                            Next
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => setShowDeleteImageConfirmModal(true)}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <ConfirmDeleteModal
                isOpen={showDeleteImageConfirmModal}
                onClose={() => setShowDeleteImageConfirmModal(false)}
                onConfirm={() => deleteImage()}
                message="This action is irreversible. Your image will be permanently deleted. Wish to proceed?"
                confirmButtonLabel="Delete Image"
            />

            <Footer />
        </>
    );
};

export default ViewPage;
