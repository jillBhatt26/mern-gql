import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client';
import * as yup from 'yup';
import { CREATE_TODO, UPDATE_TODO } from '../services/mutation/Todo';
import { FETCH_USER_TODOS } from '../services/query/Todo';
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
        useState(false);
    const [todoFormError, setTodoFormError] = useState(null);

    const todoInputsSchema = useMemo(
        () =>
            yup.object({
                name: yup
                    .string('Name should be a string')
                    .trim()
                    .required('Name is required')
                    .min(4, 'Name should be more than 4 characters long')
                    .max(255, 'Name should be less than 255 characters'),
                description: yup
                    .string('Description should be a string')
                    .trim()
                    .required('Description is required')
                    .min(4, 'Description should be more than 4 characters long')
                    .max(255, 'Description should be less than 255 characters'),
                status: yup
                    .string('Status should be a string')
                    .trim()
                    .required('Status is required')
                    .oneOf(['PENDING', 'PROGRESS', 'COMPLETE'])
            }),
        []
    );

    // hooks
    const userTodos = useTodoStore(state => state.userTodos);
    const pushNewUserTodo = useTodoStore(state => state.pushNewUserTodo);
    const setUserTodos = useTodoStore(state => state.setUserTodos);
    const [createTodo, { loading: createTodoLoading }] = useMutation(
        CREATE_TODO,
        {
            onCompleted: data => {
                if (data.CreateTodo) {
                    pushNewUserTodo(data.CreateTodo);
                    handleFormClose(false);
                }
            },
            onError: error => {
                if (error) {
                    const errorMessage = error.toString().split(':').pop();

                    setTodoFormError(errorMessage);
                }
            },
            update: (cache, { data }) => {
                if (data.CreateTodo) {
                    cache.writeQuery({
                        query: FETCH_USER_TODOS,
                        data: {
                            todos: userTodos
                        }
                    });
                }
            }
        }
    );

    const [updateTodo, { loading: updateTodoLoading }] = useMutation(
        UPDATE_TODO,
        {
            onCompleted: data => {
                if (data.UpdateTodo) {
                    const updateTodoIndex = userTodos.findIndex(
                        t => t.id === data.UpdateTodo.id
                    );

                    if (updateTodoIndex > -1) {
                        const todos = Array.from(userTodos);

                        todos[updateTodoIndex] = data.UpdateTodo;

                        setUserTodos(todos);

                        handleFormClose(false);
                    }
                }
            },
            onError: error => {
                if (error) {
                    const errorMessage = error.toString().split(':').pop();

                    setTodoFormError(errorMessage);
                }
            },
            update: (cache, { data }) => {
                if (data.UpdateTodo) {
                    cache.writeQuery({
                        query: FETCH_USER_TODOS,
                        data: {
                            todos: userTodos
                        }
                    });
                }
            }
        }
    );

    // effects
    useEffect(() => {
        if (purpose.toLowerCase() !== 'update' || !todoToUpdate) return;

        const { name, description, status } = todoToUpdate;

        setInputTodoDescription(description);
        setInputTodoName(name);
        setInputTodoStatus(status);
    }, [todoToUpdate, purpose]);

    useEffect(() => {
        setDisableFormSubmitButton(
            todoFormError !== null || createTodoLoading || updateTodoLoading
        );
    }, [todoFormError, createTodoLoading, updateTodoLoading]);

    // event handlers
    const handleTodoFormSubmit = async e => {
        e.preventDefault();

        try {
            if (
                !inputTodoName.trim() ||
                !inputTodoDescription.trim() ||
                !inputTodoStatus
            )
                return setTodoFormError('Please provide all details!');

            const todoFormInputs = await todoInputsSchema.validate({
                name: inputTodoName,
                description: inputTodoDescription,
                status: inputTodoStatus
            });

            const { name, description, status } = todoFormInputs;

            if (purpose.toLowerCase() === 'add')
                createTodo({
                    variables: {
                        createTodoInput: {
                            name,
                            description,
                            status
                        }
                    }
                });
            if (purpose.toLowerCase() === 'update')
                updateTodo({
                    variables: {
                        updateTodoInput: {
                            id: todoToUpdate.id,
                            name,
                            description,
                            status
                        }
                    }
                });
        } catch (error) {
            setTodoFormError(error.message);
        }
    };

    const resetStates = () => {
        setInputTodoName('');
        setInputTodoDescription('');
        setInputTodoStatus('PENDING');
        setDisableFormSubmitButton(true);
        setTodoFormError(null);
    };

    const handleFormClose = () => {
        resetStates();
        setShowTodoFormModal(false);
    };

    return (
        <Modal
            isOpen={showTodoFormModal}
            onClose={handleFormClose}
            onConfirm={() => {}}
        >
            <Modal.Header>
                <Modal.Header.Title
                    className={`${
                        purpose.toLowerCase() === 'update'
                            ? 'text-info'
                            : 'text-success'
                    }`}
                >
                    {purpose ?? 'Add'} Todo
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
                            <option value="COMPLETE">Complete</option>
                        </select>
                    </div>

                    <div className="d-flex justify-content-center mt-4 gap-3">
                        <button
                            type="submit"
                            className={`btn ${
                                purpose.toLowerCase() === 'update'
                                    ? 'btn-info'
                                    : 'btn-success'
                            }`}
                            disabled={disableFormSubmitButton}
                        >
                            {purpose ?? 'Add'} Todo
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleFormClose}
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
