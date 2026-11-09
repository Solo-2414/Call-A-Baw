import { useNavigate } from "react-router-dom";

export default function AuthModals({ type, isOpen, onClose, setType }) {
    const navigate = useNavigate();

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const role = document.getElementById("loginRole").value;
        onClose();
        navigate(
            role === "officer"
                ? "/agriculture_office/dashboard"
                : "/farmer/dashboard",
        );
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        alert(
            "Registration successful! You will now receive localized advisory previews.",
        );
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className={`modal-overlay ${isOpen && type === "login" ? "active" : ""}`}
                onClick={onClose}
                aria-hidden={!(isOpen && type === "login")}
            >
                <div
                    className="modal-card"
                    role="dialog"
                    aria-labelledby="loginTitle"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                    <div className="modal-header">
                        <h3 id="loginTitle">Login to Call-A-Baw</h3>
                        <p>
                            Access your seasonal planting advisories and
                            municipal risk data.
                        </p>
                    </div>
                    <form className="modal-form" onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                            <label htmlFor="loginRole">Select Your Role</label>
                            <select
                                id="loginRole"
                                className="form-control"
                                required
                            >
                                <option value="farmer">Farmer</option>
                                <option value="officer">
                                    Agricultural Office
                                </option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="loginEmail">
                                Email or Phone Number
                            </label>
                            <input
                                type="text"
                                id="loginEmail"
                                className="form-control"
                                placeholder="e.g. 09171234567 or user@example.com"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="loginPassword">Password</label>
                            <input
                                type="password"
                                id="loginPassword"
                                className="form-control"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                        >
                            Login
                        </button>
                    </form>
                    <div className="modal-footer">
                        <p>
                            Don't have an account?{" "}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setType("signup");
                                }}
                            >
                                Sign up here
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <div
                className={`modal-overlay ${isOpen && type === "signup" ? "active" : ""}`}
                onClick={onClose}
                aria-hidden={!(isOpen && type === "signup")}
            >
                <div
                    className="modal-card"
                    role="dialog"
                    aria-labelledby="signupTitle"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                    <div className="modal-header">
                        <h3 id="signupTitle">Create an Account</h3>
                        <p>
                            Register for localized agricultural alerts and
                            advisory services.
                        </p>
                    </div>
                    <form className="modal-form" onSubmit={handleSignupSubmit}>
                        <div className="form-group">
                            <label htmlFor="signupName">Full Name</label>
                            <input
                                type="text"
                                id="signupName"
                                className="form-control"
                                placeholder="Juan Dela Cruz"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signupPhone">
                                Mobile Number (For SMS Alerts)
                            </label>
                            <input
                                type="tel"
                                id="signupPhone"
                                className="form-control"
                                placeholder="09171234567"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="signupPassword">Password</label>
                            <input
                                type="password"
                                id="signupPassword"
                                className="form-control"
                                placeholder="Create password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                        >
                            Sign Up
                        </button>
                    </form>
                    <div className="modal-footer">
                        <p>
                            Already have an account?{" "}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setType("login");
                                }}
                            >
                                Login here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
