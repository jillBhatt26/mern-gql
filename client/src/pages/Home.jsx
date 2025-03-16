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
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    onConfirm={() => console.log('confirm!!')}
                >
                    <Modal.Header>
                        <Modal.Header.Title>
                            <p className="text-danger">Caution!</p>
                        </Modal.Header.Title>
                        <Modal.Header.CloseButton />
                    </Modal.Header>
                    <Modal.Body>
                        <p className="ml-5">
                            This action is irreversible. Your account and all
                            your data will be deleted. Wish to continue?
                        </p>
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-center">
                        <Modal.Footer.ConfirmButton className="btn btn-danger">
                            Delete
                        </Modal.Footer.ConfirmButton>
                        <Modal.Footer.CancelButton>
                            Cancel
                        </Modal.Footer.CancelButton>
                    </Modal.Footer>
                </Modal>

                <h1 className="text-center">Home Page</h1>
            </div>

            <Footer />
        </>
    );
};

export default HomePage;
