import { lazy, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import TodoFormModal from '../components/TodoFormModal';
import TodoList from '../components/TodoList';
import { FETCH_USER_TODOS } from '../services/query/Todo';
import Nav from '../shared/Nav';
import Footer from '../shared/Footer';
import useTodoStore from '../stores/todo';
const LoadingPage = lazy(() => import('./Loading'));

const HomePage = () => {
    // states
    const [fetchUserTodosError, setFetchUserTodosError] = useState(null);
    const [showTodoFormModal, setShowTodoFormModal] = useState(false);

    // hooks
    const userTodos = useTodoStore(state => state.userTodos);
    const setUserTodos = useTodoStore(state => state.setUserTodos);
    const { data, error, loading } = useQuery(FETCH_USER_TODOS, {
        fetchPolicy: 'network-only'
    });

    // effects
    useEffect(() => {
        if (error) {
            const errorMessage = error.toString().split(':').pop();

            setFetchUserTodosError(errorMessage);
        }
    }, [error]);

    useEffect(() => {
        if (data && data.todos) {
            setUserTodos(data.todos);
        }
    }, [data, setUserTodos]);

    if (loading) return <LoadingPage />;

    return (
        <>
            <Nav />

            <div className="container mt-5">
                {fetchUserTodosError && (
                    <div className="alert alert-dismissible alert-danger mt-5">
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setFetchUserTodosError(null)}
                        ></button>

                        {fetchUserTodosError}
                    </div>
                )}

                {userTodos.length > 0 ? (
                    <TodoList />
                ) : (
                    <div className="w-100">
                        <h3 className="text-center">
                            You haven&apos;t added any todos yet.
                            <div className="d-grid mt-5">
                                <div className="col-sm-12 col-md-4 mx-auto">
                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={() =>
                                            setShowTodoFormModal(true)
                                        }
                                    >
                                        Add new todo
                                    </button>
                                </div>
                            </div>
                        </h3>
                    </div>
                )}
            </div>

            <Footer />

            <TodoFormModal
                showTodoFormModal={showTodoFormModal}
                setShowTodoFormModal={setShowTodoFormModal}
                purpose="Add"
            />
        </>
    );
};

export default HomePage;
