export default function Footer({ openLogin }) {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <a href="#hero" className="brand-logo">
                        <svg
                            className="logo-icon"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z"></path>
                            <path d="M12 6v6l4 2"></path>
                        </svg>
                        <span>Call-A-Baw</span>
                    </a>
                    <p>
                        An AI-Powered Planting Advisory and Seasonal Alert
                        System for Small-Scale Rice and Corn Farmers During El
                        Niño.
                    </p>
                </div>

                <div className="footer-links">
                    <div className="footer-col">
                        <h4>Navigation</h4>
                        <a href="#hero">Home</a>
                        <a href="#problem">Problem</a>
                        <a href="#solution">Solution</a>
                        <a href="#features">Features</a>
                    </div>
                    <div className="footer-col">
                        <h4>Roles</h4>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                openLogin();
                            }}
                        >
                            Farmer Access
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                openLogin();
                            }}
                        >
                            Agriculture Office
                        </a>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                openLogin();
                            }}
                        >
                            Technician Review
                        </a>
                    </div>
                </div>
            </div>
            <div className="container footer-bottom">
                <p>
                    &copy; {new Date().getFullYear()} Call-A-Baw Project Team.
                    Developed for AIdeathon (Tech Connect: SYNC), BatStateU –
                    The NEU.
                </p>
            </div>
        </footer>
    );
}
