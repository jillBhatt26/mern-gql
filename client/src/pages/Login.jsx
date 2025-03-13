import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../shared/Nav';
import { LOGIN_USER } from '../services/mutation/User';
import { FETCH_ACTIVE_USER } from '../services/query/User';
import useAuthStore from '../stores/auth';

const LoginPage = () => {
    // states
    const [inputUsernameOrEmail, setInputUsernameOrEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [disableButton, setDisableButton] = useState(false);
    const [loginError, setLoginError] = useState(null);

    // hooks
    const setAuthUser = useAuthStore(state => state.setAuthUser);

    const navigate = useNavigate();

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        variables: {
            loginUserInput: {
                usernameOrEmail: inputUsernameOrEmail,
                password: inputPassword
            }
        },
        onCompleted: data => {
            if (data && data.LoginUser) {
                setAuthUser(data.LoginUser);

                return navigate('/', { replace: true });
            }
        },
        onError: error => {
            if (error) {
                const errorMessage = error.toString().split(':').pop();

                setLoginError(errorMessage);
            }
        },
        update: (cache, result) => {
            cache.writeQuery({
                query: FETCH_ACTIVE_USER,
                data: {
                    FetchActiveUser: result.data.LoginUser
                }
            });
        }
    });

    // effects
    useEffect(() => {
        setDisableButton(loading || loginError !== null);
    }, [loading, loginError]);

    // event handlers
    const handleLogin = e => {
        e.preventDefault();

        if (!inputUsernameOrEmail || !inputPassword)
            return setLoginError('Please provide all user details to login!');

        loginUser();
    };

    return (
        <>
            <Nav />

            <div className="container mt-5 col-12 col-md-8 col-lg-4">
                <h1 className="text-center">Log In</h1>

                <form autoComplete="off" noValidate onSubmit={handleLogin}>
                    <div>
                        <label
                            htmlFor="usernameOrEmail"
                            className="form-label mt-4"
                        >
                            Username or Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="usernameOrEmail"
                            placeholder="Username or email"
                            onChange={e =>
                                setInputUsernameOrEmail(e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="form-label mt-4">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            autoComplete="off"
                            onChange={e => setInputPassword(e.target.value)}
                        />
                    </div>

                    <div className="d-grid gap-2 mt-5">
                        <button
                            className={`btn btn-lg btn-success ${
                                disableButton ?? 'disabled'
                            }`}
                            type="submit"
                            disabled={disableButton}
                        >
                            Login
                        </button>
                    </div>
                </form>

                {loginError && (
                    <div className="alert alert-dismissible alert-danger mt-5">
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setLoginError(null)}
                        ></button>

                        {loginError}
                    </div>
                )}
            </div>
        </>
    );
};

export default LoginPage;
