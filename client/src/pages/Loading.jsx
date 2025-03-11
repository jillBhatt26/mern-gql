import Nav from '../shared/Nav';

const LoadingPage = () => {
    return (
        <div className="overflow-hidden">
            <Nav />

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh' // or any other height
                }}
            >
                <h1 className="text-center">Loading...</h1>
            </div>
        </div>
    );
};

export default LoadingPage;
