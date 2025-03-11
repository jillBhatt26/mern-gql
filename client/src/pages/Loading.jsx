import Nav from '../shared/Nav';

const LoadingPage = () => {
    return (
        <>
            <Nav />

            <div className="container">
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: '100vh' }}
                >
                    <h1 className="text-center">Loading...</h1>
                </div>
            </div>
        </>
    );
};

export default LoadingPage;
