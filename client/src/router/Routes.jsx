import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ErrorPage from '../pages/Error';
import HomePage from '../pages/Home';
import LoginPage from '../pages/Login';
import SignupPage from '../pages/Signup';
import TodosPage from '../pages/Todos';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/error" element={<ErrorPage />} />
                </Route>

                <Route element={<PublicRoute redirectTo="/todos" />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route path="/todos" element={TodosPage} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
