import { lazy, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import Gallery from '../components/Gallery';
import Nav from '../shared/Nav';
import Footer from '../shared/Footer';
import { FETCH_USER_IMAGES } from '../services/query/Image';
import useImagesStore from '../stores/images';

const LoadingPage = lazy(() => import('./Loading'));

const GalleryPage = () => {
    // states
    const [isFetchingUserImages, setIsFetchingUserImages] = useState(true);
    const [fetchImagesError, setFetchImagesError] = useState(null);

    // hooks
    const { data, error, loading } = useQuery(FETCH_USER_IMAGES);
    const userImages = useImagesStore(state => state.userImages);
    const setUserImages = useImagesStore(state => state.setUserImages);

    // effects
    useEffect(() => {
        setIsFetchingUserImages(loading);
    }, [loading]);

    useEffect(() => {
        if (!data) return;

        if (data.FetchUserImagesQuery) setUserImages(data.FetchUserImagesQuery);
    }, [data, setUserImages]);

    useEffect(() => {
        if (error) {
            const errorMessage = error.toString().split(':').pop();

            setFetchImagesError(errorMessage);
        }
    }, [error]);

    // event handlers
    // const handleUploadImage = async e => {
    //     e.preventDefault();
    // };

    if (isFetchingUserImages) return <LoadingPage />;

    return (
        <>
            <Nav />

            <div className="container">
                <div className="my-5">
                    <h1 className="text-center">Gallery</h1>

                    {fetchImagesError && (
                        <div className="alert alert-dismissible alert-danger mt-5">
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setFetchImagesError(null)}
                            ></button>

                            {fetchImagesError}
                        </div>
                    )}

                    {/* <form
                        noValidate
                        autoComplete="off"
                        onSubmit={handleUploadImage}
                    >
                        <div>
                            <label
                                htmlFor="formFile"
                                className="form-label mt-4"
                            >
                                Upload new image
                            </label>
                            <input
                                className="form-control"
                                type="file"
                                id="formFile"
                            />
                        </div>
                    </form> */}
                </div>

                <Gallery userImages={userImages} />
            </div>

            <Footer />
        </>
    );
};

export default GalleryPage;
