import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { SIGNUP_USER } from '../services/mutation/User';
import Nav from '../shared/Nav';

const SignupPage = () => {
    // states
    const [inputEmail, setInputEmail] = useState('');
    const [inputUsername, setInputUsername] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [signupError, setSignupError] = useState(null);
    const [disableButton, setDisableButton] = useState(false);

    // hooks
    const navigate = useNavigate();

    const [signupUser, { data, error, loading }] = useMutation(SIGNUP_USER, {
        variables: {
            signupUserInput: {
                username: inputUsername,
                email: inputEmail,
                password: inputPassword
            }
        }
    });

    // effects
    useEffect(() => {
        setDisableButton(loading || signupError !== null);
    }, [loading, signupError]);

    useEffect(() => {
        if (data && data.SignupUser && navigate) {
            navigate('/', { replace: true });
        }
    }, [data, navigate]);

    useEffect(() => {
        if (error) {
            const errorMessage = error.toString().split(':').pop();

            setSignupError(errorMessage);
        }
    }, [error]);

    // event handlers
    const handleUserSignup = e => {
        e.preventDefault();

        if (!inputEmail || !inputUsername || !inputPassword) {
            setSignupError('All fields required to sign up!');
        }

        signupUser({
            username: inputUsername,
            email: inputEmail,
            password: inputPassword
        });
    };

    return (
        <>
            <Nav />

            <div className="container mt-5 col-12 col-md-8 col-lg-4">
                <h1 className="text-center">Sign Up</h1>

                <form autoComplete="off" noValidate onSubmit={handleUserSignup}>
                    <div>
                        <label htmlFor="email" className="form-label mt-4">
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                            onChange={e => setInputEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="form-label mt-4">
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            aria-describedby="usernameHelp"
                            placeholder="Enter username"
                            onChange={e => setInputUsername(e.target.value)}
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
                            className="btn btn-lg btn-success"
                            type="submit"
                            disabled={disableButton}
                        >
                            Signup
                        </button>
                    </div>

                    {signupError && (
                        <div className="alert alert-dismissible alert-danger mt-5">
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setSignupError(null)}
                            ></button>

                            {signupError}
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default SignupPage;
