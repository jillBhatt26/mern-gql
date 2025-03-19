import { useMutation, useQuery } from '@apollo/client';
import { lazy, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

    // hooks
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

    useEffect(() => {
        if (fetchError) {
            const errorMessage = fetchError.toString().split(':').pop();

            setImageError(errorMessage);
        }
    }, [fetchError]);

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
                <div className="col-sm-12 col-md-10 mx-auto">
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
                        <button className="btn btn-warning">Gallery</button>
                        <button className="btn btn-info">Previous</button>
                        <button className="btn btn-info">Next</button>
                        <button
                            className="btn btn-danger"
                            onClick={() => deleteImage()}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default ViewPage;
