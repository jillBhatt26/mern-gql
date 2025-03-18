import { useState } from 'react';
import Image from '../shared/Image';

const Gallery = () => {
    const [images] = useState(
        Array(11)
            .fill(null)
            .map((_, idx) => `https://picsum.photos/1280/720?random=${idx}`)
    );

    return (
        <div className="container">
            {images.length > 0 &&
                images.map((img, idx) => (
                    <div
                        key={idx}
                        className="d-inline-block col-sm-12 col-md-6 col-lg-4 overflow-hidden image-container"
                    >
                        <Image key={idx} src={img} alt={img} />
                    </div>
                ))}
        </div>
    );
};

export default Gallery;
