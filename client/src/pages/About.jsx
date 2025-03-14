import Nav from '../shared/Nav';
import Footer from '../shared/Footer';

const ErrorPage = () => {
    return (
        <>
            <Nav />

            <div className="container">
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '80vh'
                    }}
                >
                    <h1 className="text-center">About Page</h1>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ErrorPage;
