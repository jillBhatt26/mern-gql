import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import UserInfoForm from '../components/UserInfoForm';
import DeleteAccountModal from '../components/DeleteAccountModal';
import { DELETE_USER } from '../services/mutation/User';
import { FETCH_ACTIVE_USER } from '../services/query/User';
import Nav from '../shared/Nav';
import Footer from '../shared/Footer';
import useAuthStore from '../stores/auth';

const SettingsPage = () => {
    // states
    const [deleteUserError, setDeleteUserError] = useState(null);
    const [disableDeleteButton, setDisableDeleteButton] = useState(false);
    const [showDeleteUserConfirmModal, setShowDeleteUserConfirmModal] =
        useState(false);

    // hooks
    const navigate = useNavigate();
    const unsetAuthUser = useAuthStore(state => state.unsetAuthUser);

    // mutations
    const [deleteUser, { loading }] = useMutation(DELETE_USER, {
        onCompleted: data => {
            if (data.DeleteUser && navigate) {
                unsetAuthUser();
                return navigate('/login', { replace: true });
            }
        },
        onError: error => {
            if (error) {
                const errorMessage = error.toString().split(':').pop();

                setDeleteUserError(errorMessage);
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
        setDisableDeleteButton(loading || deleteUserError !== null);
    }, [loading, deleteUserError]);

    // event handlers
    const handleDeleteUser = () => {
        deleteUser();
    };

    return (
        <>
            <Nav />

            <div className="container">
                <div className="container mt-5 col-12 col-md-8 col-lg-4">
                    {deleteUserError && (
                        <div className="alert alert-dismissible alert-danger mt-5">
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setDeleteUserError(null)}
                            ></button>

                            {deleteUserError}
                        </div>
                    )}

                    <UserInfoForm />

                    <div className="d-grid my-3">
                        <button
                            type="button"
                            className={`btn btn-lg btn-outline-danger border-danger ${
                                disableDeleteButton && 'disabled'
                            }`}
                            onClick={() => setShowDeleteUserConfirmModal(true)}
                            disabled={disableDeleteButton}
                        >
                            Delete account
                        </button>
                    </div>
                </div>
            </div>

            <Footer />

            <DeleteAccountModal
                showDeleteUserConfirmModal={showDeleteUserConfirmModal}
                setShowDeleteUserConfirmModal={setShowDeleteUserConfirmModal}
                handleDeleteUser={handleDeleteUser}
            />
        </>
    );
};

export default SettingsPage;
