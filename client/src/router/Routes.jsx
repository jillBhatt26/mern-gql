import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AboutPage from '../pages/About';
import ErrorPage from '../pages/Error';
import FilesPage from '../pages/Files';
import HomePage from '../pages/Home';
import LoginPage from '../pages/Login';
import ProfilePage from '../pages/Profile';
import SignupPage from '../pages/Signup';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

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
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/files" element={<FilesPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
