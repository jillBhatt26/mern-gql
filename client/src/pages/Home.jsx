import { useQuery } from '@apollo/client';
import TodoList from '../components/TodoList';
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

                <TodoList />
            </div>

            <Footer />
        </>
    );
};

export default HomePage;
