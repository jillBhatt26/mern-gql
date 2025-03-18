import Image from '../shared/Image';

const Gallery = ({ userImages }) => {
    // const [images] = useState(
    //     Array(11)
    //         .fill(null)
    //         .map((_, idx) => `https://picsum.photos/1280/720?random=${idx}`)
    // );

    return userImages.length > 0 ? (
        <div className="container">
            <div className="d-grid">
                <div className="row g-3">
                    {userImages.length > 0 &&
                        userImages.map((img, idx) => (
                            <div
                                key={idx}
                                className="col-sm-12 col-md-6 col-lg-4 mw-100"
                            >
                                <Image src={img.url} alt={img.cloudImageName} />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    ) : (
        <div className="container mt-5 mx-auto">
            <div className="w-100">
                <h3 className="text-center">
                    You haven&apos;t added any images yet.
                    <div className="d-grid mt-5">
                        <div className="col-sm-12 col-md-4 mx-auto">
                            <button type="button" className="btn btn-success">
                                Add image now
                            </button>
                        </div>
                    </div>
                </h3>
            </div>
        </div>
    );
};

export default Gallery;
