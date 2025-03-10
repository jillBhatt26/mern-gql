import Nav from '../shared/Nav';

const LoginPage = () => {
    return (
        <>
            <Nav />

            <div className="container mt-5 col-12 col-md-8 col-lg-4">
                <h1 className="text-center">Log In</h1>

                <form autoComplete="off" noValidate>
                    <div>
                        <label
                            htmlFor="usernameOrEmail"
                            className="form-label mt-4"
                        >
                            Username or Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="usernameOrEmail"
                            aria-describedby="emailHelp"
                            placeholder="Username or email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="form-label mt-4">
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            autoComplete="off"
                        />
                    </div>

                    <div className="d-grid gap-2 mt-5">
                        <button
                            className="btn btn-lg btn-success"
                            type="button"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default LoginPage;
