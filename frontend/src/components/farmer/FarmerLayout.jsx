import { Outlet, NavLink, useNavigate } from "react-router-dom";
import styles from "./FarmerLayout.module.css";

export default function FarmerLayout() {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        navigate("/");
    };

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <svg
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
                    CALL-A-BAW
                </div>
                <nav className={styles.nav}>
                    <NavLink
                        to="/farmer/dashboard"
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.navLink} ${styles.active}`
                                : styles.navLink
                        }
                    >
                        <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Planting Advisor
                    </NavLink>
                    <NavLink
                        to="#"
                        className={`${styles.navLink} ${styles.logoutBtn}`}
                        onClick={handleLogout}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                    </NavLink>
                </nav>
            </aside>

            <div className={styles.rightWrapper}>
                <header className={styles.topbar}>
                    <button
                        className={styles.menuToggle}
                        aria-label="Toggle Menu"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            width="28"
                            height="28"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className={styles.topbarRight}>
                        <div className={styles.userInfo}>
                            Daniel Rodge A. Caindoy
                            <div className={styles.avatar}>DC</div>
                        </div>
                    </div>
                </header>

                <main className={styles.mainContent}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
