import { lazy } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

const AboutPage = lazy(() => import('../pages/About'));
const ErrorPage = lazy(() => import('../pages/Error'));
const FilesPage = lazy(() => import('../pages/Files'));
const HomePage = lazy(() => import('../pages/Home'));
const LoginPage = lazy(() => import('../pages/Login'));
const SettingsPage = lazy(() => import('../pages/Settings'));
const SignupPage = lazy(() => import('../pages/Signup'));
const PrivateRoute = lazy(() => import('./PrivateRoute'));
const PublicRoute = lazy(() => import('./PublicRoute'));

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Anyone can access */}
                <Route element={<PublicRoute />}>
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<ErrorPage />} />
                </Route>

                {/* Anyone can access but not authenticated users*/}
                <Route element={<PublicRoute redirectTo="/" />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Route>

                {/* Only authenticated users can access*/}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/files" element={<FilesPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
