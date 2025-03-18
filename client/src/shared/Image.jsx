const Image = ({ className, ...props }) => {
    return (
        <img className={`mw-100 object-fit-contain ${className}`} {...props} />
    );
};

export default Image;
