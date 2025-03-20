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
    const { data, error, loading } = useQuery(FETCH_USER_IMAGES, {
        fetchPolicy: 'network-only' // NOTE: We're mandating to make a backend call and fetch the latest state of user images. Don't serve the state from the cache.
    });
    const setUserImages = useImagesStore(state => state.setUserImages);

    // effects
    useEffect(() => {
        setIsFetchingUserImages(loading);
    }, [loading]);

    useEffect(() => {
        if (!data || !data.FetchUserImagesQuery) return;

        console.log('FetchUserImagesQuery: ', data.FetchUserImagesQuery);

        if (data.FetchUserImagesQuery) setUserImages(data.FetchUserImagesQuery);
    }, [data, setUserImages]);

    useEffect(() => {
        if (error) {
            const errorMessage = error.toString().split(':').pop();

            setFetchImagesError(errorMessage);
        }
    }, [error]);

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
                </div>

                <Gallery />
            </div>

            <Footer />
        </>
    );
};

export default GalleryPage;
