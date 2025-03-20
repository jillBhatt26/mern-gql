import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TODO } from '../services/mutation/Todo';
import Modal from '../shared/Modal';
import useTodoStore from '../stores/todo';

const TodoFormModal = ({
    showTodoFormModal,
    setShowTodoFormModal,
    purpose = 'Add',
    todoToUpdate = null
}) => {
    // states
    const [inputTodoName, setInputTodoName] = useState(
        todoToUpdate ? todoToUpdate.name : ''
    );
    const [inputTodoDescription, setInputTodoDescription] = useState(
        todoToUpdate ? todoToUpdate.description : ''
    );
    const [inputTodoStatus, setInputTodoStatus] = useState(
        todoToUpdate ? todoToUpdate.status : 'PENDING'
    );
    const [disableFormSubmitButton, setDisableFormSubmitButton] =
        useState(true);
    const [todoFormError, setTodoFormError] = useState(null);

    // hooks
    const pushNewUserTodo = useTodoStore(state => state.pushNewUserTodo);
    const [createTodo, { loading }] = useMutation(CREATE_TODO, {
        variables: {
            createTodoInput: {
                description: inputTodoDescription.trim(),
                name: inputTodoName.trim(),
                status: inputTodoStatus
            }
        },
        onCompleted: data => {
            if (data.CreateTodo) {
                pushNewUserTodo(data.CreateTodo);
                setShowTodoFormModal(false);
            }
        },
        onError: error => {
            if (error) {
                const errorMessage = error.toString().split(':').pop();

                setTodoFormError(errorMessage);
            }
        }
    });

    // effects
    useEffect(() => {
        setDisableFormSubmitButton(todoFormError !== null || loading);
    }, [todoFormError, loading]);

    // event handlers
    const handleTodoFormSubmit = e => {
        e.preventDefault();

        if (
            !inputTodoName.trim() ||
            !inputTodoDescription.trim() ||
            !inputTodoStatus
        )
            return setTodoFormError('Please provide all details!');

        createTodo();
    };

    return (
        <Modal
            isOpen={showTodoFormModal}
            onClose={() => setShowTodoFormModal(false)}
            onConfirm={() => {}}
        >
            <Modal.Header>
                <Modal.Header.Title className="text-success">
                    Add new Todo
                </Modal.Header.Title>
                <Modal.Header.CloseButton />
            </Modal.Header>

            <Modal.Body className="mt-1 mb-4">
                <form
                    noValidate
                    autoComplete="off"
                    onSubmit={handleTodoFormSubmit}
                >
                    {todoFormError && (
                        <div className="alert alert-dismissible alert-danger mt-5">
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setTodoFormError(null)}
                            ></button>

                            {todoFormError}
                        </div>
                    )}

                    <div>
                        <label htmlFor="todoName" className="form-label mt-4">
                            Todo name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="todoName"
                            placeholder="Enter todo name"
                            value={inputTodoName}
                            onChange={e => setInputTodoName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="todoDescription"
                            className="form-label mt-4"
                        >
                            Add Todo Description
                        </label>
                        <textarea
                            className="form-control"
                            id="todoDescription"
                            rows={3}
                            value={inputTodoDescription}
                            onChange={e =>
                                setInputTodoDescription(e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label htmlFor="todoStatus" className="form-label mt-4">
                            Todo Status
                        </label>
                        <select
                            className="form-select"
                            id="todoStatus"
                            value={inputTodoStatus}
                            onChange={e => setInputTodoStatus(e.target.value)}
                        >
                            <option value="PENDING">Pending</option>
                            <option value="PROGRESS">Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                    </div>

                    <div className="d-flex justify-content-center mt-4 gap-3">
                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={disableFormSubmitButton}
                        >
                            {purpose ?? 'Add'} Todo
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            disabled={disableFormSubmitButton}
                            onClick={() => setShowTodoFormModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default TodoFormModal;
