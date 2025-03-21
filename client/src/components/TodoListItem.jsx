const TodoListItem = ({ todo }) => {
    return (
        <tr>
            <th scope="row">{todo.name}</th>
            <td>{todo.description}</td>
            <td>{todo.status}</td>
            <td className="d-flex gap-3">
                <button className="btn btn-sm btn-warning">Update</button>
                <button className="btn btn-sm btn-danger">Delete</button>
            </td>
        </tr>
    );
};

export default TodoListItem;
