import { useQuery } from '@apollo/client';
import { FETCH_USER_TODOS } from '../services/query/Todo';
import Nav from '../shared/Nav';
import Footer from '../shared/Footer';
import useTodoStore from '../stores/todo';
import { lazy, useEffect, useState } from 'react';
const LoadingPage = lazy(() => import('./Loading'));

const HomePage = () => {
    // states
    const [fetchUserTodosError, setFetchUserTodosError] = useState(null);

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

                {userTodos.length > 0 && (
                    <table className="table table-hover mt-5">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Status</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {userTodos.map(todo => (
                                <tr key={todo.id} className="table-active">
                                    <th scope="row">{todo.name}</th>
                                    <td>{todo.description}</td>
                                    <td>{todo.status}</td>
                                    <td className="d-flex justify-content-center gap-2">
                                        <button className="btn btn-warning">
                                            Update
                                        </button>
                                        <button className="btn btn-danger">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Footer />
        </>
    );
};

export default HomePage;
