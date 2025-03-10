const Nav = () => {
    return (
        <nav
            className="navbar navbar-expand-lg bg-primary"
            data-bs-theme="dark"
        >
            <div className="container py-1">
                <a
                    className="navbar-brand fs-4"
                    href="#"
                    style={{ border: 'none' }}
                >
                    GQL TM
                </a>

                <form className="d-flex gap-3 py-2">
                    <div>
                        <input
                            className="form-control form-control"
                            type="text"
                            placeholder="Username or email"
                            id="usernameOrEmail"
                        />
                    </div>

                    <div>
                        <input
                            className="form-control form-control"
                            type="password"
                            placeholder="Password"
                            id="password"
                        />
                    </div>

                    <button type="button" className="btn btn-info fw-bold">
                        Login
                    </button>
                </form>
            </div>
        </nav>
    );
};

export default Nav;
