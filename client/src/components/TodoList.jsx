import useTodoState from '../stores/todo';
import TodoListItem from './TodoListItem';

const TodoList = () => {
    const userTodos = useTodoState(state => state.userTodos);

    return (
        <>
            {userTodos.length > 0 && (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userTodos.map(todo => (
                                <TodoListItem key={todo.id} todo={todo} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default TodoList;
