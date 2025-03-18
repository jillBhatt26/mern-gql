import Nav from '../shared/Nav';
import Footer from '../shared/Footer';
import Gallery from '../components/Gallery';

const GalleryPage = () => {
    // event handlers
    const handleUploadImage = async e => {
        e.preventDefault();
    };

    return (
        <>
            <Nav />

            <div className="container">
                <div className="my-5">
                    <h1 className="text-center">Gallery</h1>

                    <form
                        noValidate
                        autoComplete="off"
                        onSubmit={handleUploadImage}
                    >
                        <div>
                            <label
                                htmlFor="formFile"
                                className="form-label mt-4"
                            >
                                Upload new image
                            </label>
                            <input
                                className="form-control"
                                type="file"
                                id="formFile"
                            />
                        </div>
                    </form>
                </div>

                <Gallery />
            </div>

            <Footer />
        </>
    );
};

export default GalleryPage;
