import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="container footer bg-dark text-center my-5 d-flex justify-content-center gap-2">
            <span className="text-muted">
                Website developed by{' '}
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
                <Link to="/about" className="text-info text-decoration-none">
                    Learn more.
                </Link>
            </span>
        </footer>
    );
};

export default Footer;
