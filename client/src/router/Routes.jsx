import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ErrorPage from '../pages/Error';
import HomePage from '../pages/Home';
import LoginPage from '../pages/Login';
import SignupPage from '../pages/Signup';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<HomePage />} />
                </Route>

                <Route element={<PublicRoute redirectTo="/" />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Route>

                <Route path="/error" element={<ErrorPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
