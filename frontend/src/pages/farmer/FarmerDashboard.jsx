import { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./FarmerDashboard.module.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

export default function FarmerDashboard() {
    const [selectedCrop, setSelectedCrop] = useState("Rice");
    const [isFilipino, setIsFilipino] = useState(false);
    const [showAdvice, setShowAdvice] = useState(false);

    const handleGenerateAdvice = () => {
        setShowAdvice(true);
    };

    const chartData = {
        labels: ["Oct", "Nov", "Dec", "Jan"],
        datasets: [
            {
                label: "Upper Forecast Bound",
                data: [150, 110, 80, 95],
                borderColor: "rgba(79, 195, 247, 0)",
                backgroundColor: "rgba(79, 195, 247, 0.2)",
                fill: 1,
                pointRadius: 0,
                tension: 0.4,
            },
            {
                label: "Lower Forecast Bound",
                data: [90, 60, 30, 45],
                borderColor: "rgba(79, 195, 247, 0)",
                backgroundColor: "transparent",
                fill: false,
                pointRadius: 0,
                tension: 0.4,
            },
            {
                label: "Expected Rainfall (mm)",
                data: [120, 85, 55, 70],
                borderColor: "#4fc3f7",
                backgroundColor: "#4fc3f7",
                borderWidth: 2,
                tension: 0.4,
            },
            {
                label: "Historical Baseline (PAGASA)",
                data: [210, 180, 150, 120],
                borderColor: "#263238",
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0,
                borderWidth: 1.5,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: { font: { family: "'Inter', sans-serif" } },
            },
        },
        scales: {
            y: { beginAtZero: true, grid: { color: "#e0e6ed" } },
            x: { grid: { display: false } },
        },
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.headerRow}>
                <div>
                    <h1 className={styles.pageTitle}>Planting Advisor</h1>
                    <p className={styles.pageSubtitle}>
                        Localized climate risk tracking and prescriptive farm
                        actions.
                    </p>
                </div>
            </div>

            <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiHeader}>
                        <div
                            className={`${styles.kpiIcon} ${styles.iconDanger}`}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                        <span className={styles.kpiLabel}>Rice Crop Risk</span>
                    </div>
                    <div className={`${styles.kpiValue} ${styles.valueDanger}`}>
                        High Risk
                    </div>
                    <div className={styles.kpiAction}>
                        Action: Delay planting 30 days
                    </div>
                </div>

                <div className={styles.kpiCard}>
                    <div className={styles.kpiHeader}>
                        <div
                            className={`${styles.kpiIcon} ${styles.iconWarning}`}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </div>
                        <span className={styles.kpiLabel}>Corn Crop Risk</span>
                    </div>
                    <div
                        className={`${styles.kpiValue} ${styles.valueWarning}`}
                    >
                        Medium Risk
                    </div>
                    <div className={styles.kpiAction}>
                        Action: Assess soil moisture
                    </div>
                </div>

                <div className={styles.kpiCard}>
                    <div className={styles.kpiHeader}>
                        <div
                            className={`${styles.kpiIcon} ${styles.iconDanger}`}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                        </div>
                        <span className={styles.kpiLabel}>
                            Predictive Heat Index
                        </span>
                    </div>
                    <div className={`${styles.kpiValue} ${styles.valueDanger}`}>
                        42°C (Extreme)
                    </div>
                    <div className={styles.kpiAction}>
                        Action: Restrict field work 10AM-3PM
                    </div>
                </div>
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.leftCol}>
                    <div className={styles.sectionCard}>
                        <h3 className={styles.sectionTitle}>
                            Local Rainfall Forecast Outlook (1-3 Months)
                        </h3>
                        <div className={styles.chartContainer}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    </div>

                    <div
                        className={styles.transparencyPanel}
                        style={{ marginTop: "24px" }}
                    >
                        <div className={styles.transparencyHeader}>
                            <svg
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                style={{ color: "var(--accent)" }}
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            <h3 className={styles.transparencyTitle}>
                                AI Model Transparency
                            </h3>
                        </div>
                        <table className={styles.modelTable}>
                            <thead>
                                <tr>
                                    <th>Predictive Model</th>
                                    <th>Mean Absolute Error (MAE)</th>
                                    <th>Root Mean Square Error (RMSE)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Seasonal Baseline (Historical)</td>
                                    <td>28.4 mm</td>
                                    <td>35.1 mm</td>
                                </tr>
                                <tr>
                                    <td>El Niño Analog Method</td>
                                    <td>19.2 mm</td>
                                    <td>22.6 mm</td>
                                </tr>
                                <tr>
                                    <td
                                        style={{
                                            fontWeight: 600,
                                            color: "var(--primary)",
                                        }}
                                    >
                                        XGBoost (Active)
                                    </td>
                                    <td
                                        style={{
                                            fontWeight: 600,
                                            color: "var(--primary)",
                                        }}
                                    >
                                        12.5 mm
                                    </td>
                                    <td
                                        style={{
                                            fontWeight: 600,
                                            color: "var(--primary)",
                                        }}
                                    >
                                        15.3 mm
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className={styles.disclaimer}>
                            <strong>Note:</strong> PAGASA's official regional
                            forecasts serve as the primary foundational
                            reference for these local municipality predictions.
                        </div>
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.sectionCard}>
                        <h3 className={styles.sectionTitle}>
                            Generate Prescriptive Advice
                        </h3>
                        <div className={styles.advisorForm}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Target Location
                                </label>
                                <input
                                    type="text"
                                    className={`${styles.formControl} ${styles.formControlFixed}`}
                                    value="Pilot Municipality"
                                    readOnly
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    Select Crop
                                </label>
                                <select
                                    className={styles.formControl}
                                    value={selectedCrop}
                                    onChange={(e) =>
                                        setSelectedCrop(e.target.value)
                                    }
                                >
                                    <option value="Rice">Rainfed Rice</option>
                                    <option value="Corn">Rainfed Corn</option>
                                </select>
                            </div>
                            <button
                                className={styles.generateBtn}
                                onClick={handleGenerateAdvice}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Generate Advice
                            </button>
                        </div>

                        {showAdvice && (
                            <div className={styles.phonePreview}>
                                <div className={styles.phoneHeader}>
                                    <div className={styles.phoneAppTitle}>
                                        Messages
                                    </div>
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="16"
                                        height="16"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <circle cx="12" cy="12" r="1"></circle>
                                        <circle cx="12" cy="5" r="1"></circle>
                                        <circle cx="12" cy="19" r="1"></circle>
                                    </svg>
                                </div>
                                <div className={styles.phoneBody}>
                                    <div className={styles.smsBubble}>
                                        {isFilipino ? (
                                            <>
                                                <strong>
                                                    CALL-A-BAW ALERT
                                                </strong>
                                                <br />
                                                <br />
                                                <strong>TANIM:</strong>{" "}
                                                {selectedCrop === "Rice"
                                                    ? "Palay"
                                                    : "Mais"}
                                                <br />
                                                <strong>PELIGRO:</strong>{" "}
                                                {selectedCrop === "Rice"
                                                    ? "MATAAS"
                                                    : "KATAMTAMAN"}{" "}
                                                (Dry Spell)
                                                <br />
                                                <strong>ULAN:</strong>{" "}
                                                Inaasahang bababa ng 55mm sa
                                                susunod na buwan.
                                                <br />
                                                <strong>PAYO:</strong>{" "}
                                                {selectedCrop === "Rice"
                                                    ? "Ipagpaliban muna ang pagtatanim. Maghintay ng ulan bago magpunla."
                                                    : "Suriin ang basa ng lupa. Maaaring magtanim kung sapat ang tubig."}
                                                <br />
                                                <br />
                                                Sangguniin ang inyong Municipal
                                                Agriculturist.
                                            </>
                                        ) : (
                                            <>
                                                <strong>
                                                    CALL-A-BAW ALERT
                                                </strong>
                                                <br />
                                                <br />
                                                <strong>CROP:</strong>{" "}
                                                {selectedCrop}
                                                <br />
                                                <strong>RISK:</strong>{" "}
                                                {selectedCrop === "Rice"
                                                    ? "HIGH"
                                                    : "MEDIUM"}{" "}
                                                (Dry Spell)
                                                <br />
                                                <strong>FORECAST:</strong>{" "}
                                                Rainfall expected to drop to
                                                55mm next month.
                                                <br />
                                                <strong>ADVICE:</strong>{" "}
                                                {selectedCrop === "Rice"
                                                    ? "Delay planting. Wait for consistent rain before sowing."
                                                    : "Assess soil moisture. Proceed with planting only if irrigation is available."}
                                                <br />
                                                <br />
                                                Consult your Municipal
                                                Agriculturist.
                                            </>
                                        )}
                                        <div className={styles.smsMeta}>
                                            <span>Just Now</span>
                                            <span className={styles.aiBadge}>
                                                AI-Assisted
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showAdvice && (
                            <div className={styles.toggleContainer}>
                                <span className={styles.toggleLabel}>EN</span>
                                <input
                                    type="checkbox"
                                    checked={isFilipino}
                                    onChange={() => setIsFilipino(!isFilipino)}
                                    style={{
                                        width: "40px",
                                        height: "20px",
                                        cursor: "pointer",
                                    }}
                                />
                                <span className={styles.toggleLabel}>FIL</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
