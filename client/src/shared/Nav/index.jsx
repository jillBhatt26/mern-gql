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
    const authUser = useAuthStore(state => state.authUser);
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
            case '/profile':
            case '/files':
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
            case '/profile':
            case '/files':
                logoutUser();
                break;
        }
    };

    return (
        <nav
            className="navbar navbar-expand-lg bg-primary"
            data-bs-theme="dark"
        >
            <div className="container py-1 px-2  px-md-0">
                <Link
                    to="/"
                    className="navbar-brand fs-4"
                    style={{ border: 'none' }}
                >
                    GQL TM
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarColor01"
                    aria-controls="navbarColor01"
                    aria-expanded="true"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div
                    className="navbar-collapse collapse"
                    id="navbarColor01"
                    style={{}}
                >
                    <ul className="navbar-nav me-auto">
                        {authUser && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        to="/"
                                        className="nav-link"
                                        style={{ border: 'none' }}
                                    >
                                        Home
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        to="/profile"
                                        className="nav-link"
                                        style={{ border: 'none' }}
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        to="/files"
                                        className="nav-link"
                                        style={{ border: 'none' }}
                                    >
                                        Files
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>

                    <div className="d-grid">
                        <button
                            type="button"
                            className="btn btn-info fw-bold mt-1 mb-3 mx-3 m-md-0"
                            onClick={handleNavButtonClick}
                            disabled={disableNavButton}
                        >
                            {navButtonLabel}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
