import { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../shared/Image';
import AddImageModal from './AddImageFormModal';
import useImagesStore from '../stores/images';

const Gallery = () => {
    // states
    const [showAddImageFormModal, setShowAddImageFormModal] = useState(false);

    // const [images] = useState(
    //     Array(11)
    //         .fill(null)
    //         .map((_, idx) => `https://picsum.photos/1280/720?random=${idx}`)
    // );

    // hooks
    const userImages = useImagesStore(state => state.userImages);

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
                                <Link to={`/view/${img._id}`}>
                                    <Image
                                        src={img.url}
                                        alt={img.cloudImageName}
                                    />
                                </Link>
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
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => setShowAddImageFormModal(true)}
                            >
                                Add image now
                            </button>
                        </div>
                    </div>
                </h3>
            </div>

            <AddImageModal
                showAddImageFormModal={showAddImageFormModal}
                setShowAddImageFormModal={setShowAddImageFormModal}
            />
        </div>
    );
};

export default Gallery;
