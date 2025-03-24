import Footer from '../shared/Footer';
import Nav from '../shared/Nav';

const AboutPage = () => {
    return (
        <>
            <Nav />

            <div className="container mt-5">
                <h1 className="text-center">About GQL TM</h1>

                <div className="accordion mt-5" id="accordionExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseOne"
                                aria-expanded="false"
                                aria-controls="collapseOne"
                            >
                                <h5>Modules</h5>
                            </button>
                        </h2>
                        <div
                            id="collapseOne"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingOne"
                            data-bs-parent="#accordionExample"
                            style={{}}
                        >
                            <div className="accordion-body">
                                <div>
                                    <a
                                        href="#"
                                        className="list-group-item list-group-item-action active p-2"
                                    >
                                        <h5>User authentication</h5>
                                    </a>
                                    <a
                                        href="#"
                                        className="list-group-item list-group-item-action active p-2"
                                    >
                                        <h5>Tasks manager</h5>
                                    </a>
                                    <a
                                        href="#"
                                        className="list-group-item list-group-item-action active p-2"
                                    >
                                        <h5>Image gallery</h5>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseTwo"
                                aria-expanded="false"
                                aria-controls="collapseTwo"
                            >
                                <h5>Client</h5>
                            </button>
                        </h2>
                        <div
                            id="collapseTwo"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingTwo"
                            data-bs-parent="#accordionExample"
                            style={{}}
                        >
                            <div className="accordion-body">
                                <div>
                                    <a
                                        href="#"
                                        className="list-group-item list-group-item-action active p-2"
                                    >
                                        <h5>React.js using vite</h5>
                                    </a>
                                    <a
                                        href="#"
                                        className="list-group-item list-group-item-action active p-2"
                                    >
                                        <h5>Bootstrap Theme</h5>
                                    </a>
                                    <a
                                        href="#"
                                        className="list-group-item list-group-item-action active p-2"
                                    >
                                        <h5>Apollo Client</h5>
                                    </a>
                                    <a
                                        href="#"
                                        className="list-group-item list-group-item-action active p-2"
                                    >
                                        <h5>Zustand</h5>
                                    </a>
                                    <a
                                        href="#"
                                        className="list-group-item list-group-item-action active p-2"
                                    >
                                        <h5>
                                            Public and Private Route Components
                                        </h5>
                                    </a>
                                    <a
                                        href="#"
                                        className="list-group-item list-group-item-action active p-2"
                                    >
                                        <h5>Reusable modal component</h5>
                                    </a>
                                    <a
                                        href="#"
                                        className="list-group-item list-group-item-action active p-2"
                                    >
                                        <h5>Custom hooks</h5>
                                    </a>
                                    <a
                                        href="#"
                                        className="list-group-item list-group-item-action active p-2"
                                    >
                                        <h5>
                                            Code splitting by using React.lazy
                                        </h5>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseThree"
                                aria-expanded="false"
                                aria-controls="collapseThree"
                            >
                                <h5>Server</h5>
                            </button>
                        </h2>
                        <div
                            id="collapseThree"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingThree"
                            data-bs-parent="#accordionExample"
                            style={{}}
                        >
                            <div className="accordion-body">
                                <a
                                    href="#"
                                    className="list-group-item list-group-item-action active p-2"
                                >
                                    <h5>Express.js</h5>
                                </a>

                                <a
                                    href="#"
                                    className="list-group-item list-group-item-action active p-2"
                                >
                                    <h5>GraphQL Schema</h5>
                                </a>

                                <a
                                    href="#"
                                    className="list-group-item list-group-item-action active p-2"
                                >
                                    <h5>Apollo Server</h5>
                                </a>

                                <a
                                    href="#"
                                    className="list-group-item list-group-item-action active p-2"
                                >
                                    <h5>
                                        express-session and connect-mongo
                                        session management
                                    </h5>
                                </a>

                                <a
                                    href="#"
                                    className="list-group-item list-group-item-action active p-2"
                                >
                                    <h5>Supabase cloud storage</h5>
                                </a>

                                <a
                                    href="#"
                                    className="list-group-item list-group-item-action active p-2"
                                >
                                    <h5>GraphQL Shield authentication</h5>
                                </a>

                                <a
                                    href="#"
                                    className="list-group-item list-group-item-action active p-2"
                                >
                                    <h5>GraphQL File Upload</h5>
                                </a>

                                <a
                                    href="#"
                                    className="list-group-item list-group-item-action active p-2"
                                >
                                    <h5>Supertest e2e tests</h5>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default AboutPage;
