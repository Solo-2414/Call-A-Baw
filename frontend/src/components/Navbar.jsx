import { useState, useEffect } from "react";

export default function Navbar({ openLogin, openSignup }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const navObserverOptions = {
            root: null,
            rootMargin: "-20% 0px -70% 0px",
            threshold: 0,
        };
        const sections = document.querySelectorAll("section[id]");

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.getAttribute("id"));
                }
            });
        }, navObserverOptions);

        sections.forEach((section) => navObserver.observe(section));
        return () => navObserver.disconnect();
    }, []);

    const handleNavClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="navbar">
            <div className="nav-container container">
                <a href="#hero" className="brand-logo">
                    <svg
                        className="logo-icon"
                        viewBox="0 0 24 24"
                        width="28"
                        height="28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z"></path>
                        <path d="M12 6v6l4 2"></path>
                        <path d="M7 16c2-1 4-1 6 0s4 1 6 0"></path>
                    </svg>
                    <span>Call-A-Baw</span>
                </a>

                <nav
                    className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}
                    id="navLinks"
                >
                    <a
                        href="#hero"
                        className={`nav-link ${activeSection === "hero" ? "active" : ""}`}
                        onClick={handleNavClick}
                    >
                        Home
                    </a>
                    <a
                        href="#problem"
                        className={`nav-link ${activeSection === "problem" ? "active" : ""}`}
                        onClick={handleNavClick}
                    >
                        Problem
                    </a>
                    <a
                        href="#solution"
                        className={`nav-link ${activeSection === "solution" ? "active" : ""}`}
                        onClick={handleNavClick}
                    >
                        Solution
                    </a>
                    <a
                        href="#features"
                        className={`nav-link ${activeSection === "features" ? "active" : ""}`}
                        onClick={handleNavClick}
                    >
                        Key Features
                    </a>
                    <a
                        href="#sdg"
                        className={`nav-link ${activeSection === "sdg" ? "active" : ""}`}
                        onClick={handleNavClick}
                    >
                        SDG Alignment
                    </a>
                </nav>

                <div className="auth-buttons">
                    <button className="btn btn-outline" onClick={openLogin}>
                        Login
                    </button>
                    <button className="btn btn-primary" onClick={openSignup}>
                        Sign Up
                    </button>
                </div>

                <button
                    className="mobile-toggle"
                    aria-label="Toggle navigation menu"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <span className="hamburger"></span>
                </button>
            </div>
        </header>
    );
}
