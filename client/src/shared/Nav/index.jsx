import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LOGOUT_USER } from '../../services/mutation/User';
import { FETCH_ACTIVE_USER } from '../../services/query/User';
import useAuthStore from '../../stores/auth';

const Nav = () => {
    // states
    const [navButtonLabel, setNavButtonLabel] = useState('Signup');
    const [disableNavButton, setDisableNavButton] = useState(false);

    // hooks
    const navigate = useNavigate();
    const location = useLocation();
    const unsetAuthUser = useAuthStore(state => state.unsetAuthUser);
    const [logoutUser, { loading }] = useMutation(LOGOUT_USER, {
        onCompleted: data => {
            if (data && data.LogoutUser) {
                unsetAuthUser();
                return navigate('/login', { replace: true });
            }
        },
        onError: () => {
            navigate('/error', { replace: true });
        },
        update: cache => {
            // NOTE: Most important step. Please clear the FETCH_ACTIVE_USER cache and delete all the data as it will show a logged in user even though the session is deleted in the backend.
            cache.writeQuery({
                query: FETCH_ACTIVE_USER,
                data: {
                    FetchActiveUser: null
                }
            });
        }
    });

    // effects
    useEffect(() => {
        setDisableNavButton(loading);
    }, [loading]);

    useEffect(() => {
        switch (location.pathname) {
            default:
                setNavButtonLabel('Signup');

                break;

            case '/login':
                setNavButtonLabel('Signup');
                break;

            case '/signup':
            case '/about':
                setNavButtonLabel('Login');
                break;

            case '/error':
                setNavButtonLabel('Home');
                break;

            case '/':
            case '/todos':
                setNavButtonLabel('Logout');
                break;
        }
    }, [location.pathname]);

    // event handlers
    const handleNavButtonClick = e => {
        e.preventDefault();

        switch (location.pathname) {
            default:
                navigate('/');
                break;

            case '/login':
                navigate('/signup');
                break;

            case '/signup':
            case '/about':
                navigate('/login');
                break;

            case '/error':
                navigate('/');
                break;

            case '/':
                logoutUser();
                break;
        }
    };

    return (
        <nav
            className="navbar navbar-expand-lg bg-primary"
            data-bs-theme="dark"
        >
            <div className="container py-1">
                <Link
                    to="/"
                    className="navbar-brand fs-4"
                    href="#"
                    style={{ border: 'none' }}
                >
                    GQL TM
                </Link>

                <button
                    type="button"
                    className="btn btn-info fw-bold"
                    onClick={handleNavButtonClick}
                    disabled={disableNavButton}
                >
                    {navButtonLabel}
                </button>
            </div>
        </nav>
    );
};

export default Nav;
