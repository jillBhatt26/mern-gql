import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_TODO } from '../services/mutation/Todo';
import useTodoState from '../stores/todo';
import TodoFormModal from './TodoFormModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const TodoListItem = ({ todo }) => {
    // states
    const [showDeleteTodoModal, setShowDeleteTodoModal] = useState(false);
    const [showUpdateTodoModal, setShowUpdateTodoModal] = useState(false);
    const [todoError, setTodoError] = useState(null);
    const [statusTextClass, setStatusTextClass] = useState('text-primary');

    // hooks
    const userTodos = useTodoState(state => state.userTodos);
    const setUserTodos = useTodoState(state => state.setUserTodos);
    const [deleteTodo, { loading }] = useMutation(DELETE_TODO, {
        variables: {
            id: todo.id
        },
        onCompleted: data => {
            if (data.DeleteTodo) {
                setUserTodos(userTodos.filter(t => t.id !== todo.id));
                setShowDeleteTodoModal(false);
            }
        },
        onError: error => {
            const errorMessage = error.toString().split(':').pop();

            setTodoError(errorMessage);
        }
    });

    // effects
    useEffect(() => {
        if (todo.status.toUpperCase() === 'PENDING')
            return setStatusTextClass('text-danger');

        if (todo.status.toUpperCase() === 'PROGRESS')
            return setStatusTextClass('text-info');

        if (todo.status.toUpperCase() === 'COMPLETE')
            return setStatusTextClass('text-success');
    }, [todo.status]);

    return (
        <tr>
            <th scope="row">{todo.name}</th>
            <td>{todo.description}</td>
            <td className={statusTextClass}>{todo.status}</td>
            <td className="d-flex gap-3">
                <button
                    className="btn btn-sm btn-warning"
                    onClick={() => setShowUpdateTodoModal(true)}
                >
                    Update
                </button>
                <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setShowDeleteTodoModal(true)}
                >
                    Delete
                </button>
            </td>

            <ConfirmDeleteModal
                isOpen={showDeleteTodoModal}
                onClose={() => setShowDeleteTodoModal(false)}
                onConfirm={deleteTodo}
                message={
                    loading
                        ? 'Loading...'
                        : 'This action is irreversible. Your todo will be permanently deleted. Wish to proceed?'
                }
                confirmButtonLabel="Delete Todo"
                error={todoError}
            />

            <TodoFormModal
                showTodoFormModal={showUpdateTodoModal}
                setShowTodoFormModal={setShowUpdateTodoModal}
                purpose="Update"
                todoToUpdate={todo}
            />
        </tr>
    );
};

export default TodoListItem;
