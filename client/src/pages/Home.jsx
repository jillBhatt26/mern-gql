import { useState } from 'react';
import Nav from '../shared/Nav';
import Footer from '../shared/Footer';
import Modal from '../shared/Modal';

const HomePage = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <Nav />

            <div className="container">
                <div className="d-grid my-5">
                    <button
                        className="btn btn-success col-md-3 mx-auto"
                        onClick={() => setIsOpen(true)}
                    >
                        Open Modal
                    </button>
                </div>
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />

                <h1 className="text-center">Home Page</h1>
            </div>

            <Footer />
        </>
    );
};

export default HomePage;
