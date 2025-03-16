import { lazy, Suspense } from 'react';
import LoadingPage from './Loading';

const Nav = lazy(() => import('../shared/Nav'));
const Footer = lazy(() => import('../shared/Footer'));

const AboutPage = () => {
    return (
        <>
            <Suspense fallback={<LoadingPage />}>
                <Nav />
            </Suspense>

            <div className="container">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '80vh'
                    }}
                >
                    <h1 className="text-center">About Page</h1>
                </div>
            </div>

            <Suspense fallback={<LoadingPage />}>
                <Footer />
            </Suspense>
        </>
    );
};

export default AboutPage;
