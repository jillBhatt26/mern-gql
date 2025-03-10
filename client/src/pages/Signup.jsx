import Nav from '../shared/Nav';

const SignupPage = () => {
    return (
        <>
            <Nav />

            <div className="container mt-5 col-12 col-md-8 col-lg-4">
                <h1 className="text-center">Sign Up</h1>

                <form autoComplete="off" noValidate>
                    <div>
                        <label htmlFor="email" className="form-label mt-4">
                            Email address
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            aria-describedby="emailHelp"
                            placeholder="Enter email"
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="form-label mt-4">
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            aria-describedby="usernameHelp"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="exampleInputPassword1"
                            className="form-label mt-4"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="Password"
                            autoComplete="off"
                        />
                    </div>

                    <div className="d-grid gap-2 mt-5">
                        <button
                            className="btn btn-lg btn-success"
                            type="button"
                        >
                            Signup
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default SignupPage;
