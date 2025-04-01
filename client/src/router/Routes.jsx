import { lazy, Suspense } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LoadingPage from '../pages/Loading';

const AboutPage = lazy(() => import('../pages/About'));
const ErrorPage = lazy(() => import('../pages/Error'));
const GalleryPage = lazy(() => import('../pages/Gallery'));
const HomePage = lazy(() => import('../pages/Home'));
const LoginPage = lazy(() => import('../pages/Login'));
const SettingsPage = lazy(() => import('../pages/Settings'));
const SignupPage = lazy(() => import('../pages/Signup'));
const ViewPage = lazy(() => import('../pages/ViewPage'));
const PrivateRoute = lazy(() => import('./PrivateRoute'));
const PublicRoute = lazy(() => import('./PublicRoute'));

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Anyone can access */}
                <Route element={<PublicRoute />}>
                    <Route
                        path="/about"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                <AboutPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                <ErrorPage />
                            </Suspense>
                        }
                    />
                </Route>

                {/* Anyone can access but not authenticated users*/}
                <Route element={<PublicRoute redirectTo="/" />}>
                    <Route
                        path="/login"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                <LoginPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                <SignupPage />
                            </Suspense>
                        }
                    />
                </Route>

                {/* Only authenticated users can access*/}
                <Route element={<PrivateRoute />}>
                    <Route
                        path="/"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                <HomePage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                <SettingsPage />
                            </Suspense>
                        }
                    />
                    <Route
                        path="/gallery"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                <GalleryPage />
                            </Suspense>
                        }
                    />

                    <Route
                        path="/view/:id"
                        element={
                            <Suspense fallback={<LoadingPage />}>
                                <ViewPage />
                            </Suspense>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
