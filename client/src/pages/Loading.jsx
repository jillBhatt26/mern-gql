import Nav from '../shared/Nav';
import Footer from '../shared/Footer';

const LoadingPage = () => {
    return (
        <div className="overflow-hidden">
            <Nav />

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh'
                }}
            >
                <h1 className="text-center">Loading...</h1>
            </div>

            <Footer />
        </div>
    );
};

export default LoadingPage;
