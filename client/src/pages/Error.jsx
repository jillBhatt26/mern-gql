import { useNavigate } from 'react-router-dom';
import Nav from '../shared/Nav';

const ErrorPage = () => {
    // hooks
    const navigate = useNavigate();

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
                    <h1 className="text-center">Requested page not found!</h1>

                    <div className="d-grid gap-2 mt-3">
                        <button
                            className="btn btn-lg btn-info"
                            type="button"
                            onClick={() => navigate('/')}
                        >
                            Home
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ErrorPage;
