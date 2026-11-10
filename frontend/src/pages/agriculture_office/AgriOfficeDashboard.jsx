import { useEffect, useState } from "react";
import ForecastChart from "../../components/ForecastChart";
import styles from "./AgriOfficeDashboard.module.css";
import {
    CROPS,
    assessRisk,
    assessMonth,
    upcomingMonths,
    RISK_STYLE,
    ACTION_SHORT,
} from "../../risk";

const WARNING_PATH =
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01";

const CARD_CLASS = {
    LOW: styles.cardPrimary,
    MEDIUM: styles.cardAccent,
    HIGH: styles.cardDanger,
};
const STATUS_CLASS = {
    LOW: styles.statusLow,
    MEDIUM: styles.statusMedium,
    HIGH: styles.statusHigh,
};

function KpiCard({ label, value, className }) {
    return (
        <div className={`${styles.kpiCard} ${className}`}>
            <div className={styles.kpiIcon}>
                <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d={WARNING_PATH}></path>
                </svg>
            </div>
            <div className={styles.kpiInfo}>
                <span className={styles.kpiLabel}>{label}</span>
                <span className={styles.kpiValue}>{value}</span>
            </div>
        </div>
    );
}

export default function AgriOfficeDashboard() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [cropFilter, setCropFilter] = useState("All");

    useEffect(() => {
        fetch("/forecast.json")
            .then((r) => {
                if (!r.ok) throw new Error("missing forecast.json");
                return r.json();
            })
            .then(setData)
            .catch(() => setError(true));
    }, []);

    if (error) {
        return (
            <div className={styles.dashboard}>
                <h1 className={styles.pageTitle}>Pilot Area Overview</h1>
                <p>
                    forecast.json not found. Run <code>python forecast.py</code>{" "}
                    in the backend folder first.
                </p>
            </div>
        );
    }
    if (!data) {
        return (
            <div className={styles.dashboard}>
                <p>Loading forecast…</p>
            </div>
        );
    }

    const cycleFilter = () =>
        setCropFilter((f) => (f === "All" ? "Rice" : f === "Rice" ? "Corn" : "All"));

    const riceResult = assessRisk("Rice", data.forecast);
    const cornResult = assessRisk("Corn", data.forecast);
    const oni = data.latest_oni;
    const best = data.model_stats[data.best_model];
    const months = upcomingMonths(data.forecast).slice(0, 3);
    const crops = cropFilter === "All" ? ["Rice", "Corn"] : [cropFilter];

    return (
        <div className={styles.dashboard}>
            <div className={styles.headerRow}>
                <h1 className={styles.pageTitle}>
                    Pilot Area Overview{" "}
                    <span
                        style={{
                            fontSize: "0.75rem",
                            fontWeight: 500,
                            padding: "4px 10px",
                            borderRadius: "999px",
                            background: "#eef3f8",
                            color: "#546e7a",
                            marginLeft: "8px",
                            verticalAlign: "middle",
                        }}
                    >
                        {data.location} · thresholds provisional
                    </span>
                </h1>
                <button className={styles.filterBtn} onClick={cycleFilter}>
                    Crop: {cropFilter}
                </button>
            </div>

            <div className={styles.kpiGrid}>
                <KpiCard
                    label="Rainfed Rice Risk"
                    value={RISK_STYLE[riceResult.risk].label}
                    className={CARD_CLASS[riceResult.risk]}
                />
                <KpiCard
                    label="Rainfed Corn Risk"
                    value={RISK_STYLE[cornResult.risk].label}
                    className={CARD_CLASS[cornResult.risk]}
                />
                <KpiCard
                    label="El Niño Index (ONI)"
                    value={`${oni > 0 ? "+" : ""}${oni.toFixed(1)}`}
                    className={styles.cardSecondary}
                />
                <KpiCard
                    label={`Model in use · MAE ${Math.round(best.mae)} mm`}
                    value={data.best_model}
                    className={styles.cardPrimary}
                />
            </div>

            <div className={styles.chartSection}>
                <h3 className={styles.sectionTitle}>
                    Monthly Rainfall Forecast vs. Crop Requirements
                </h3>
                <ForecastChart
                    forecast={data.forecast}
                    needCrops={crops}
                    riskCrop={cropFilter === "All" ? null : cropFilter}
                />
            </div>

            <div className={styles.tableSection}>
                <h2>Month-by-Month Recommended Action</h2>
                <div className={styles.tableContainer}>
                    <table className={styles.dataGrid}>
                        <thead>
                            <tr>
                                <th>Crop Type</th>
                                <th>Validation Status</th>
                                {months.map((m) => (
                                    <th key={m.month}>{m.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {crops.map((crop) => (
                                <tr key={crop}>
                                    <td
                                        style={{
                                            color: "var(--text-main)",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {CROPS[crop].en}
                                    </td>
                                    <td style={{ color: "var(--text-muted)" }}>
                                        Provisional - pending technician review
                                    </td>
                                    {months.map((m) => {
                                        const r = assessMonth(crop, m);
                                        return (
                                            <td
                                                key={m.month}
                                                className={STATUS_CLASS[r.risk]}
                                            >
                                                {RISK_STYLE[r.risk].label}:{" "}
                                                {ACTION_SHORT[r.action]}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Forecast from {data.data_source}, using data through{" "}
                    {data.issue_month}. Advice is decision support for
                    technician review; PAGASA's official forecasts remain the
                    primary reference.
                </p>
            </div>
        </div>
    );
}
