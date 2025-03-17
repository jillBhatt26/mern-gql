import Nav from '../shared/Nav';
import Footer from '../shared/Footer';

const LoadingPage = () => {
    return (
        <div className="overflow-hidden">
            <Nav />

            <div
                className="container"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh'
                }}
            >
                <div className="w-100">
                    <h1 className="text-center">Loading...</h1>

                    <div className="d-grid">
                        <div className="progress mt-5 w-full col-xs-12 col-md-8 col-lg-6 mx-auto">
                            <div
                                className="progress-bar progress-bar-striped bg-info"
                                role="progressbar"
                                style={{ width: '100%' }}
                                aria-valuenow={100}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default LoadingPage;
