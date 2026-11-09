import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModals from "../components/AuthModals";

export default function LandingPage() {
    const [modalState, setModalState] = useState({ isOpen: false, type: null });

    const openModal = (type) => {
        setModalState({ isOpen: true, type });
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setModalState({ isOpen: false, type: null });
        document.body.style.overflow = "";
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            document
                .querySelector(".animate-slide-left")
                ?.classList.add("animate-in");
            document
                .querySelector(".animate-slide-right")
                ?.classList.add("animate-in");
        }, 100);

        const animObserverOptions = { root: null, threshold: 0.15 };
        const animObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-in");
                } else {
                    entry.target.classList.remove("animate-in");
                }
            });
        }, animObserverOptions);

        document.querySelectorAll(".animate-on-scroll").forEach((element) => {
            animObserver.observe(element);
        });

        return () => {
            clearTimeout(timer);
            animObserver.disconnect();
        };
    }, []);

    return (
        <>
            <Navbar
                openLogin={() => openModal("login")}
                openSignup={() => openModal("signup")}
            />

            <main>
                <section className="hero-section section-hero" id="hero">
                    <div className="container hero-grid">
                        <div className="hero-content animate-slide-left">
                            <span className="badge">
                                AI-Powered Agriculture Advisory
                            </span>
                            <h1>
                                Protecting Farmers Against El Niño Dry Spells
                            </h1>
                            <p className="hero-subtext">
                                Call-A-Baw translates climate forecasts into
                                clear, localized farm decisions for small-scale
                                rainfed rice and corn farmers. Receive timely
                                planting advice via simple SMS previews.
                            </p>
                            <div className="hero-actions">
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={() => openModal("signup")}
                                >
                                    Get Advisory Alerts
                                </button>
                                <a
                                    href="#solution"
                                    className="btn btn-outline btn-lg"
                                >
                                    How It Works
                                </a>
                            </div>
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <span className="stat-number">
                                        1-3 Months
                                    </span>
                                    <span className="stat-label">
                                        Rainfall Forecast Window
                                    </span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">
                                        SMS Ready
                                    </span>
                                    <span className="stat-label">
                                        Filipino & English Alerts
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="hero-card-wrapper animate-slide-right">
                            <div className="phone-preview-card">
                                <div className="phone-header">
                                    <span className="phone-speaker"></span>
                                    <span className="phone-title">
                                        SMS Advisory Preview
                                    </span>
                                </div>
                                <div className="phone-body">
                                    <div className="sms-bubble">
                                        <div className="sms-sender">
                                            CALL-A-BAW ALERT
                                        </div>
                                        <p className="sms-text">
                                            <strong>
                                                RISK: HIGH DRY SPELL
                                            </strong>
                                            <br />
                                            Pilot Municipality: Rainfed Corn &
                                            Rice.
                                            <br />
                                            Forecast shows below-normal rainfall
                                            for the next 60 days. <br />
                                            <strong>ADVICE:</strong> Delay
                                            planting or select drought-tolerant
                                            crops. Consult local technician.
                                        </p>
                                        <span className="sms-time">
                                            Just Now
                                        </span>
                                    </div>
                                    <div className="preview-badge">
                                        <span className="status-dot warning"></span>
                                        High Dry-Spell Risk Detected
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className="problem-section section-padding section-problem"
                    id="problem"
                >
                    <div className="container">
                        <div className="section-header text-center animate-on-scroll">
                            <span className="section-tag">The Challenge</span>
                            <h2>
                                The Gap Between Forecasts and Farm Decisions
                            </h2>
                            <p>
                                Small-scale rainfed rice and corn farmers face
                                severe dry spells without localized,
                                easy-to-understand guidance on when to plant and
                                what crops to choose.
                            </p>
                        </div>
                        <div className="problem-grid">
                            <div className="card problem-card animate-on-scroll">
                                <div className="card-icon danger-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3>Severe Climate Risk</h3>
                                <p>
                                    PAGASA outlooks indicate high probabilities
                                    of strong El Niño conditions, bringing
                                    prolonged below-normal rainfall across
                                    agricultural regions.
                                </p>
                            </div>
                            <div className="card problem-card animate-on-scroll">
                                <div className="card-icon warning-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3>Heavy Crop Losses</h3>
                                <p>
                                    Past El Niño events caused billions in
                                    damage to rice and corn harvests. Many
                                    losses begin with unguided decisions made
                                    before planting starts.
                                </p>
                            </div>
                            <div className="card problem-card animate-on-scroll">
                                <div className="card-icon info-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3>Complex Outlooks</h3>
                                <p>
                                    Traditional regional calendars have reduced
                                    reliability due to climate variability,
                                    while scientific climate forecasts remain
                                    hard for individual farmers to translate
                                    into immediate action.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className="solution-section section-padding section-solution"
                    id="solution"
                >
                    <div className="container">
                        <div className="section-header text-center animate-on-scroll">
                            <span className="section-tag">Our Approach</span>
                            <h2>
                                One Clear Farm Decision from Climate Forecasts
                            </h2>
                            <p>
                                Call-A-Baw connects rainfall modeling with
                                agronomic rules to output clear actions
                                delivered straight to municipal offices and
                                basic mobile phones.
                            </p>
                        </div>
                        <div className="solution-steps">
                            <div className="step-card animate-on-scroll">
                                <div className="step-number">01</div>
                                <h3>Rainfall Forecasting</h3>
                                <p>
                                    Machine learning models (including XGBoost
                                    and El Niño analog methods) forecast 1-to-3
                                    month rainfall ranges for the pilot
                                    municipality.
                                </p>
                            </div>
                            <div className="step-card animate-on-scroll">
                                <div className="step-number">02</div>
                                <h3>Crop Risk Assessment</h3>
                                <p>
                                    Forecast ranges are evaluated against
                                    DA/PhilRice crop water-need thresholds to
                                    determine low, medium, or high dry-spell
                                    risk levels.
                                </p>
                            </div>
                            <div className="step-card animate-on-scroll">
                                <div className="step-number">03</div>
                                <h3>Plain-Language Alerts</h3>
                                <p>
                                    A controlled language model formats the
                                    decision into short, clear SMS messages in
                                    simple Filipino or English without changing
                                    the underlying advice.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className="features-section section-padding section-features"
                    id="features"
                >
                    <div className="container">
                        <div className="section-header text-center animate-on-scroll">
                            <span className="section-tag">System Features</span>
                            <h2>Built for Farmers & Agricultural Officers</h2>
                            <p>
                                Core features designed for simplicity,
                                transparency, and actionable decision-making.
                            </p>
                        </div>
                        <div className="features-grid">
                            <div className="feature-item animate-on-scroll">
                                <div className="feature-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3>Local Rainfall Outlook Range</h3>
                                    <p>
                                        Presents monthly rainfall forecasts as
                                        range intervals alongside historical
                                        baseline and model accuracy metrics.
                                    </p>
                                </div>
                            </div>
                            <div className="feature-item animate-on-scroll">
                                <div className="feature-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3>Risk Score & Planting Action</h3>
                                    <p>
                                        Provides explicit suggestions: plant
                                        now, wait, or switch to crops requiring
                                        less water based on verified local
                                        thresholds.
                                    </p>
                                </div>
                            </div>
                            <div className="feature-item animate-on-scroll">
                                <div className="feature-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3>Basic Phone SMS Preview</h3>
                                    <p>
                                        Formats localized alerts into concise
                                        text messages suitable for basic mobile
                                        devices in simple English or Filipino.
                                    </p>
                                </div>
                            </div>
                            <div className="feature-item animate-on-scroll">
                                <div className="feature-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3>Agriculture Office Overview</h3>
                                    <p>
                                        Single-page view summarizing municipal
                                        risk scores, forecast trends, and
                                        guidance to help prioritize seed and
                                        irrigation support.
                                    </p>
                                </div>
                            </div>
                            <div className="feature-item animate-on-scroll">
                                <div className="feature-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h3>Transparency Panel</h3>
                                    <p>
                                        Shows active models and reported
                                        MAE/RMSE errors while maintaining PAGASA
                                        official outlooks as the primary
                                        national benchmark.
                                    </p>
                                </div>
                            </div>
                            <div className="feature-item animate-on-scroll">
                                <div className="feature-icon">
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3>Human-in-the-Loop Safeguards</h3>
                                    <p>
                                        Allows municipal technicians to review
                                        and validate advisory output prior to
                                        broad distribution.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className="sdg-section section-padding section-sdg"
                    id="sdg"
                >
                    <div className="container">
                        <div className="section-header text-center animate-on-scroll">
                            <span className="section-tag">Global Goals</span>
                            <h2>Aligned Sustainable Development Goals</h2>
                            <p>
                                Supporting climate resilience and food security
                                through practical advisory technology.
                            </p>
                        </div>
                        <div className="sdg-grid">
                            <div className="sdg-card animate-on-scroll">
                                <div className="sdg-badge">SDG 13</div>
                                <h3>Climate Action</h3>
                                <p>
                                    Call-A-Baw supports climate adaptation by
                                    providing early warnings and actionable risk
                                    scores, allowing farmers to adapt planting
                                    timings to extreme weather.
                                </p>
                            </div>
                            <div className="sdg-card animate-on-scroll">
                                <div className="sdg-badge warning-badge">
                                    SDG 2
                                </div>
                                <h3>Zero Hunger</h3>
                                <p>
                                    By protecting rainfed rice and corn crops
                                    from unguided dry-spell losses, Call-A-Baw
                                    helps safeguard smallholder agricultural
                                    yield and regional food supplies.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="cta-section section-padding section-cta">
                    <div className="container text-center animate-on-scroll">
                        <h2>Ready to Receive Localized Crop Advisories?</h2>
                        <p>
                            Access the municipal advisory overview or register
                            to test advisory previews for your local pilot area.
                        </p>
                        <div className="cta-buttons">
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => openModal("signup")}
                            >
                                Create Account
                            </button>
                            <button
                                className="btn btn-outline btn-lg"
                                onClick={() => openModal("login")}
                            >
                                Login to Advisory View
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer openLogin={() => openModal("login")} />

            <AuthModals
                isOpen={modalState.isOpen}
                type={modalState.type}
                onClose={closeModal}
                setType={(type) => setModalState({ ...modalState, type })}
            />
        </>
    );
}
