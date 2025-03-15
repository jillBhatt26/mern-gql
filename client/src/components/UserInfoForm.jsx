import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../services/mutation/User';
import { FETCH_ACTIVE_USER } from '../services/query/User';
import useAuthStore from '../stores/auth';

const UserInfoForm = () => {
    // states
    const [inputUsername, setInputUsername] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [updateUserError, setUpdateUserError] = useState(null);
    const [disableButton, setDisableButton] = useState(false);

    // hooks
    const navigate = useNavigate();
    const authUser = useAuthStore(state => state.authUser);
    const unsetAuthUser = useAuthStore(state => state.unsetAuthUser);

    const [updateUser, { loading }] = useMutation(UPDATE_USER, {
        variables: {
            updateUserInputs: {}
        },
        onCompleted: data => {
            if (data.UpdateUser && navigate) {
                unsetAuthUser();
                return navigate('/login', { replace: true });
            }
        },
        onError: error => {
            if (error) {
                const errorMessage = error.toString().split(':').pop();

                setUpdateUserError(errorMessage);
            }
        },
        update: cache => {
            cache.writeQuery({
                query: FETCH_ACTIVE_USER,
                data: {
                    FetchActiveUser: null
                }
            });
        }
    });

    // effects
    useEffect(() => {
        setDisableButton(loading || updateUserError !== null);
    }, [loading, updateUserError]);

    // event handlers
    const handleUpdateUserSubmit = async e => {
        e.preventDefault();

        const updateUserInputs = {};

        if (inputEmail && inputEmail.trim())
            updateUserInputs.email = inputEmail.trim();

        if (inputUsername && inputUsername.trim())
            updateUserInputs.username = inputUsername.trim();

        if (inputPassword && inputPassword.trim())
            updateUserInputs.password = inputPassword.trim();

        if (!Object.keys(updateUserInputs).length)
            return setUpdateUserError('Enter any one value to update user!');

        if (updateUserInputs.email === authUser.email)
            return setUpdateUserError(
                'New email should be different than existing one'
            );

        if (updateUserInputs.username === authUser.username)
            return setUpdateUserError(
                'New username should be different than existing one'
            );

        updateUser({
            variables: {
                updateUserInputs: {
                    ...updateUserInputs
                }
            }
        });
    };

    return (
        <>
            <h1 className="text-center">Update Account</h1>

            {updateUserError && (
                <div className="alert alert-dismissible alert-danger mt-5">
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setUpdateUserError(null)}
                    ></button>

                    {updateUserError}
                </div>
            )}

            <form
                noValidate
                autoComplete="off"
                onSubmit={handleUpdateUserSubmit}
            >
                <div>
                    <label
                        htmlFor="usernameOrEmail"
                        className="form-label mt-4"
                    >
                        New Username
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="username"
                        placeholder="New username"
                        onChange={e => setInputUsername(e.target.value)}
                    />
                </div>

                <div>
                    <label
                        htmlFor="usernameOrEmail"
                        className="form-label mt-4"
                    >
                        New Email
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="New email"
                        onChange={e => setInputEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label
                        htmlFor="usernameOrEmail"
                        className="form-label mt-4"
                    >
                        New Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="New password"
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
                        Update account
                    </button>
                </div>
            </form>
        </>
    );
};

export default UserInfoForm;
