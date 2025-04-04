import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import * as yup from 'yup';
import YupPassword from 'yup-password';
import { UPDATE_USER } from '../services/mutation/User';
import { FETCH_ACTIVE_USER } from '../services/query/User';
import useAuthStore from '../stores/auth';
import UpdateAccountModal from './UpdateAccountModal';

// extend yup
YupPassword(yup);

const UserInfoForm = () => {
    // states
    const [inputUsername, setInputUsername] = useState('');
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputConfirmPassword, setInputConfirmPassword] = useState('');
    const [updateUserInputs, setUpdateUserInputs] = useState({});
    const [updateUserError, setUpdateUserError] = useState(null);
    const [disableButton, setDisableButton] = useState(false);
    const [showUpdateUserConfirmModal, setShowUpdateUserConfirmModal] =
        useState(false);

    // hooks
    const navigate = useNavigate();
    const authUser = useAuthStore(state => state.authUser);
    const unsetAuthUser = useAuthStore(state => state.unsetAuthUser);

    const settingsInputsSchema = useMemo(
        () =>
            yup
                .object({
                    username: yup
                        .string()
                        .trim()
                        .optional()
                        .min(
                            4,
                            'Username should be more than 4 characters long'
                        )
                        .max(
                            255,
                            'Username should be less than 255 characters long'
                        )
                        .matches(
                            /^[^\s<>&'"\\]+$/,
                            'Cannot contain spaces or special characters'
                        )
                        .notOneOf(
                            [authUser.username],
                            'New username cannot be same as existing one'
                        ),
                    email: yup
                        .string()
                        .trim()
                        .optional()
                        .email('Invalid email provided')
                        .notOneOf(
                            [authUser.email],
                            'New email cannot be same as existing one'
                        ),
                    password: yup
                        .string()
                        .trim()
                        .optional()
                        .password()
                        .min(
                            4,
                            'Password should be more than 4 characters long'
                        )
                        .max(
                            255,
                            'Password should be less than 255 characters long'
                        ),
                    confirmPassword: yup
                        .string()
                        .trim()
                        .optional()
                        .password()
                        .oneOf([yup.ref('password')], 'Passwords should match!')
                })
                .required('All Inputs Required!'),
        [authUser]
    );

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

        const updateUserInputsData = {};

        try {
            if (inputEmail.trim().length)
                updateUserInputsData.email = inputEmail;

            if (inputUsername.trim().length)
                updateUserInputsData.username = inputUsername;

            if (
                inputPassword.trim().length &&
                inputConfirmPassword.trim().length
            ) {
                updateUserInputsData.password = inputPassword;
                updateUserInputsData.confirmPassword = inputConfirmPassword;
            }

            if (
                (!inputPassword && inputConfirmPassword) ||
                (inputPassword && !inputConfirmPassword)
            ) {
                return setUpdateUserError(
                    'Provide password and confirm password values'
                );
            }

            if (!Object.keys(updateUserInputsData).length)
                return setUpdateUserError(
                    'Enter all required values to update user!'
                );

            const updateUserInp = await settingsInputsSchema.validate(
                updateUserInputsData
            );

            const { username, email, password } = updateUserInp;

            setUpdateUserInputs({
                username,
                email,
                password
            });

            setShowUpdateUserConfirmModal(true);
        } catch (error) {
            setUpdateUserError(error.message);
        }
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
                    <label htmlFor="password" className="form-label mt-4">
                        New Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="New password"
                        value={inputPassword}
                        onChange={e => setInputPassword(e.target.value)}
                    />
                </div>

                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="form-label mt-4"
                    >
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirm New password"
                        value={inputConfirmPassword}
                        onChange={e => setInputConfirmPassword(e.target.value)}
                    />
                </div>

                <div className="d-grid gap-2 mt-5">
                    <button
                        className={`btn btn-lg btn-outline-warning border-warning ${
                            disableButton ?? 'disabled'
                        }`}
                        type="submit"
                        disabled={disableButton}
                    >
                        Update account
                    </button>
                </div>
            </form>

            <UpdateAccountModal
                showUpdateUserConfirmModal={showUpdateUserConfirmModal}
                setShowUpdateUserConfirmModal={setShowUpdateUserConfirmModal}
                handleUpdateUser={() => {
                    updateUser({
                        variables: {
                            updateUserInputs: {
                                ...updateUserInputs
                            }
                        }
                    });
                }}
            />
        </>
    );
};

export default UserInfoForm;
