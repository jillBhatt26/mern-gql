import Nav from '../shared/Nav';
import Footer from '../shared/Footer';

const FilesPage = () => {
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
                    <h1 className="text-center">Files Page</h1>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default FilesPage;
