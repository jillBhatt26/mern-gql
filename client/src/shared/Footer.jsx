import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
    // hooks
    const location = useLocation();

    return (
        <footer className="container footer bg-dark text-center my-5">
            <div className="d-flex justify-content-center gap-2">
                <span className="text-muted">
                    &copy; {new Date().getFullYear()}. Website developed by{' '}
                    <a
                        href="https://www.linkedin.com/in/jill-bhatt"
                        target="_blank"
                        className="link-success text-decoration-none"
                    >
                        Jill Bhatt
                    </a>
                    .
                </span>
                <span>
                    {location.pathname.includes('about') ? (
                        <a
                            href="https://github.com/jillBhatt26/graphql-express-reference"
                            target="_blank"
                            className="text-info text-decoration-none"
                        >
                            Github Repository.
                        </a>
                    ) : (
                        <Link
                            to="/about"
                            className="text-info text-decoration-none"
                        >
                            Learn more.
                        </Link>
                    )}
                </span>
            </div>
            <p className="w-100 text-center mt-2 text-muted">
                Website hosted on{' '}
                <a
                    href="https://render.com"
                    target="_blank"
                    className="text-success text-decoration-none"
                >
                    render.com
                </a>
            </p>
        </footer>
    );
};

export default Footer;
