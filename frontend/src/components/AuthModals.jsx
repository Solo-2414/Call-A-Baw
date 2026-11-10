import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ACCOUNTS_STORAGE_KEY = "call-a-baw-accounts";

async function getAccounts() {
    const savedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (savedAccounts) {
        return JSON.parse(savedAccounts);
    }

    const response = await fetch("/accounts.json");
    if (!response.ok) {
        throw new Error("Unable to load account data.");
    }

    return response.json();
}

export default function AuthModals({ type, isOpen, onClose, setType }) {
    const navigate = useNavigate();
    const [authError, setAuthError] = useState("");

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const role = formData.get("role");
        const identifier = formData.get("identifier").trim().toLowerCase();
        const password = formData.get("password");

        try {
            const accounts = await getAccounts();
            const account = accounts.find(
                (candidate) =>
                    candidate.role === role &&
                    ((candidate.email || "").toLowerCase() === identifier ||
                        candidate.phone === identifier) &&
                    candidate.password === password,
            );

            if (!account) {
                setAuthError("Invalid role, email/phone number, or password.");
                return;
            }
        } catch (error) {
            setAuthError(error.message);
            return;
        }

        setAuthError("");
        onClose();
        navigate(
            role === "officer"
                ? "/agriculture_office/dashboard"
                : "/farmer/dashboard",
        );
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const account = {
            name: formData.get("name").trim(),
            phone: formData.get("phone").trim(),
            password: formData.get("password"),
            role: "farmer",
        };

        getAccounts()
            .then((accounts) => {
                const updatedAccounts = [...accounts, account];
                localStorage.setItem(
                    ACCOUNTS_STORAGE_KEY,
                    JSON.stringify(updatedAccounts),
                );
                setAuthError("");
                alert(
                    "Registration successful! You can now log in with your phone number and password.",
                );
                setType("login");
            })
            .catch((error) => setAuthError(error.message));
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
                                name="role"
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
                                name="identifier"
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
                                name="password"
                                className="form-control"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {authError && <p className="auth-error">{authError}</p>}
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
                                name="name"
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
                                name="phone"
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
                                name="password"
                                className="form-control"
                                placeholder="Create password"
                                required
                            />
                        </div>
                        {authError && <p className="auth-error">{authError}</p>}
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
