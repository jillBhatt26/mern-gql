import { useQuery } from '@apollo/client';
import { lazy, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../shared/Nav';
import Footer from '../shared/Footer';
import Image from '../shared/Image';
import { FETCH_USER_IMAGE } from '../services/query/Image';
const LoadingPage = lazy(() => import('./Loading'));

const ViewPage = () => {
    // states
    const [fetchImageError, setFetchImageError] = useState(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // hooks
    const params = useParams();
    const { data, error, loading } = useQuery(FETCH_USER_IMAGE, {
        variables: {
            id: params.id
        }
    });

    useEffect(() => {
        if (error) {
            const errorMessage = error.toString().split(':').pop();

            setFetchImageError(errorMessage);
        }
    }, [error]);

    if (loading) return <LoadingPage />;

    return (
        <>
            <Nav />

            <div className="container mt-5">
                {fetchImageError && (
                    <div className="alert alert-dismissible alert-danger mt-5">
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setFetchImageError(null)}
                        ></button>

                        {fetchImageError}
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
                        <button className="btn btn-danger">Delete</button>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
};

export default ViewPage;
