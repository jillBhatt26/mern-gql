const Image = ({ className, ...props }) => {
    return (
        <img className={`mw-100 object-fit-cover ${className}`} {...props} />
    );
};

export default Image;
