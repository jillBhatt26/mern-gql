import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Nav = () => {
    // states
    const [navButtonLabel, setNavButtonLabel] = useState('Signup');

    // hooks
    const navigate = useNavigate();
    const location = useLocation();

    // effects
    useEffect(() => {
        switch (location.pathname) {
            default:
                setNavButtonLabel('Signup');

                break;

            case '/login':
                setNavButtonLabel('Signup');
                break;

            case '/signup':
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
                navigate('/login');
                break;

            case '/error':
                navigate('/');
                break;

            case '/':
            case '/todos':
                // TODO: Handle logout
                navigate('/login');
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
                >
                    {navButtonLabel}
                </button>
            </div>
        </nav>
    );
};

export default Nav;
