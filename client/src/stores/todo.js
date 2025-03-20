import { create } from 'zustand';

const useTodoStore = create(set => ({
    userTodos: [],
    setUserTodos: todos => {
        set(state => ({
            ...state,
            userTodos: todos
        }));
    },
    pushNewUserTodo: newTodo => {
        set(state => ({
            ...state,
            userTodos: [newTodo, ...state.userTodos]
        }));
    },
    removeAllUserTodos: () => {
        set(state => ({
            ...state,
            userTodos: []
        }));
    }
}));

export default useTodoStore;
