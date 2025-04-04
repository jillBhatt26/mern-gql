import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import Nav from '../shared/Nav';
import Footer from '../shared/Footer';
import { LOGIN_USER } from '../services/mutation/User';
import { FETCH_ACTIVE_USER } from '../services/query/User';
import useAuthStore from '../stores/auth';

YupPassword(yup);

// yup validations

const loginInputsSchema = yup.object({
    usernameOrEmail: yup
        .string('Username or email should be string')
        .trim()
        .required('Either username or email is required')
        .min(4, 'Username or email should be at least 4 characters long')
        .max(
            255,
            'Username or email should not be more than 255 characters long'
        ),
    password: yup
        .string('Password should be string')
        .trim()
        .required('Password is required')
        .password()
});

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
    const handleLogin = async e => {
        e.preventDefault();

        try {
            if (!inputUsernameOrEmail.trim() || !inputPassword.trim())
                return setLoginError('All fields required!');

            const loginUserInput = await loginInputsSchema.validate({
                usernameOrEmail: inputUsernameOrEmail,
                password: inputPassword
            });

            loginUser({
                variables: {
                    loginUserInput
                }
            });
        } catch (error) {
            setLoginError(error.message);
        }
    };

    return (
        <>
            <Nav />

            <div className="container mt-5 col-12 col-md-8 col-lg-4">
                <h1 className="text-center">Log In</h1>

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
                            {loading ? (
                                <div className="progress">
                                    <div
                                        className="progress-bar progress-bar-striped bg-success"
                                        role="progressbar"
                                        style={{ width: '100%' }}
                                        aria-valuenow={100}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    />
                                </div>
                            ) : (
                                <span>Login</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <Footer />
        </>
    );
};

export default LoginPage;
