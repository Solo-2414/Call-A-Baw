import { useEffect, useState } from "react";
import ForecastChart from "../../components/ForecastChart";
import styles from "./FarmerDashboard.module.css";
import {
    CROPS,
    assessRisk,
    assessMonth,
    upcomingMonths,
    buildSms,
    RISK_STYLE,
    ACTION_SHORT,
    THRESHOLDS,
} from "../../risk";

const RISK_COLOR = {
    LOW: "var(--primary)",
    MEDIUM: "var(--warning)",
    HIGH: "var(--danger)",
};
const RISK_BG = { LOW: "#e8f5e9", MEDIUM: "#fff3e0", HIGH: "#fdecea" };
const CARD = {
    background: "#fff",
    border: "1px solid var(--border-color)",
    borderRadius: "var(--border-radius-md)",
    boxShadow: "var(--shadow-sm)",
    padding: "20px 24px",
};

function oniStatus(oni) {
    if (oni >= 0.5) return { text: "El Niño conditions", tone: "warning" };
    if (oni <= -0.5) return { text: "La Niña conditions", tone: "primary" };
    return { text: "Neutral", tone: "primary" };
}

export default function FarmerDashboard() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState("Rice");
    const [isFilipino, setIsFilipino] = useState(false);
    const [showAdvice, setShowAdvice] = useState(false);

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
                <h1 className={styles.pageTitle}>Planting Advisor</h1>
                <p className={styles.pageSubtitle}>
                    forecast.json not found. Run <code>python forecast.py</code>{" "}
                    in the backend folder first.
                </p>
            </div>
        );
    }
    if (!data) {
        return (
            <div className={styles.dashboard}>
                <p className={styles.pageSubtitle}>Loading forecast…</p>
            </div>
        );
    }

    const riceResult = assessRisk("Rice", data.forecast);
    const cornResult = assessRisk("Corn", data.forecast);
    const selected = selectedCrop === "Rice" ? riceResult : cornResult;
    const sms = buildSms(selected, isFilipino ? "fil" : "en");
    const oni = oniStatus(data.latest_oni);
    const months = upcomingMonths(data.forecast).slice(0, 3);
    const spanLabel = months
        .slice(0, 2)
        .map((m) => m.label)
        .join(" & ");

    const bestStyle = { fontWeight: 600, color: "var(--primary)" };

    return (
        <div className={styles.dashboard}>
            <div className={styles.headerRow}>
                <div>
                    <h1 className={styles.pageTitle}>Planting Advisor</h1>
                    <p className={styles.pageSubtitle}>
                        {data.location} · forecast issued from data through{" "}
                        {data.issue_month}
                    </p>
                </div>
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background:
                            oni.tone === "warning" ? "#fff3e0" : "#e8f5e9",
                        color:
                            oni.tone === "warning"
                                ? "var(--warning)"
                                : "var(--primary)",
                        border: "1px solid currentColor",
                        borderRadius: "999px",
                        padding: "8px 16px",
                        fontWeight: 600,
                    }}
                >
                    El Niño index {data.latest_oni > 0 ? "+" : ""}
                    {data.latest_oni.toFixed(1)} · {oni.text}
                </div>
            </div>

            <div
                style={{
                    background: "#eef3f8",
                    color: "var(--text-muted)",
                    borderRadius: "var(--border-radius-sm)",
                    padding: "8px 14px",
                    fontSize: "0.85rem",
                    marginBottom: "20px",
                }}
            >
                Prototype: SMS is preview-only, crop thresholds are
                provisional, and PAGASA's official forecast remains the
                primary reference.
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "20px",
                    marginBottom: "24px",
                }}
            >
                {[riceResult, cornResult].map((r) => (
                    <div
                        key={r.crop}
                        style={{
                            ...CARD,
                            borderLeft: `6px solid ${RISK_COLOR[r.risk]}`,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "0.8rem",
                                    color: "var(--text-muted)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                {CROPS[r.crop].en}
                            </span>
                            <span
                                style={{
                                    background: RISK_BG[r.risk],
                                    color: RISK_COLOR[r.risk],
                                    borderRadius: "999px",
                                    padding: "2px 12px",
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                }}
                            >
                                {RISK_STYLE[r.risk].label}
                            </span>
                        </div>
                        <div
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontSize: "1.5rem",
                                fontWeight: 700,
                                color: RISK_COLOR[r.risk],
                                margin: "4px 0",
                            }}
                        >
                            {ACTION_SHORT[r.action]}
                        </div>
                        <div style={{ color: "var(--text-main)" }}>
                            {spanLabel}: {r.expectedMm} mm/month expected vs{" "}
                            {r.normalMm} mm normal.
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ ...CARD, marginBottom: "24px" }}>
                <h3 className={styles.sectionTitle}>Month-by-Month Outlook</h3>
                {["Rice", "Corn"].map((crop) => (
                    <div
                        key={crop}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                            marginTop: "10px",
                        }}
                    >
                        <strong style={{ width: "110px" }}>
                            {CROPS[crop].en}
                        </strong>
                        {months.map((m) => {
                            const r = assessMonth(crop, m);
                            return (
                                <div
                                    key={m.month}
                                    style={{
                                        background: RISK_BG[r.risk],
                                        color: RISK_COLOR[r.risk],
                                        border: `1px solid ${RISK_COLOR[r.risk]}`,
                                        borderRadius: "999px",
                                        padding: "6px 14px",
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {m.label}: {RISK_STYLE[r.risk].label} ·{" "}
                                    {ACTION_SHORT[r.action]}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.leftCol}>
                    <div className={styles.sectionCard}>
                        <h3 className={styles.sectionTitle}>
                            Local Rainfall Forecast Outlook (1-3 Months)
                        </h3>
                        <ForecastChart
                            forecast={data.forecast}
                            needCrops={[selectedCrop]}
                            riskCrop={selectedCrop}
                        />
                    </div>

                    <details
                        open
                        style={{ ...CARD, marginTop: "24px" }}
                    >
                        <summary
                            style={{ cursor: "pointer", fontWeight: 600 }}
                        >
                            Why this advice? ({CROPS[selectedCrop].en})
                        </summary>
                        <table
                            className={styles.modelTable}
                            style={{ marginTop: "12px" }}
                        >
                            <tbody>
                                <tr>
                                    <td>Expected rainfall (avg. {spanLabel})</td>
                                    <td>{selected.expectedMm} mm/month</td>
                                </tr>
                                <tr>
                                    <td>Normal rainfall, same months</td>
                                    <td>{selected.normalMm} mm/month</td>
                                </tr>
                                <tr>
                                    <td>Crop water need (provisional)</td>
                                    <td>{selected.needMm} mm/month</td>
                                </tr>
                                <tr>
                                    <td>Expected ÷ need</td>
                                    <td>{selected.ratioNeed.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Expected ÷ normal</td>
                                    <td>{selected.ratioNormal.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p
                            style={{
                                color: "var(--text-muted)",
                                fontSize: "0.85rem",
                                marginTop: "12px",
                            }}
                        >
                            Rules: HIGH if either ratio is below{" "}
                            {THRESHOLDS.HIGH_BELOW}; MEDIUM if expected ÷ need
                            is below {THRESHOLDS.MEDIUM_NEED_BELOW} or expected
                            ÷ normal is below {THRESHOLDS.MEDIUM_NORMAL_BELOW};
                            otherwise LOW. Result: {selected.risk} →{" "}
                            {ACTION_SHORT[selected.action]}. This decision is
                            made by fixed rules, not by AI.
                        </p>
                    </details>

                    <div
                        className={styles.transparencyPanel}
                        style={{ marginTop: "24px" }}
                    >
                        <div className={styles.transparencyHeader}>
                            <h3 className={styles.transparencyTitle}>
                                AI Model Transparency
                            </h3>
                        </div>
                        <table className={styles.modelTable}>
                            <thead>
                                <tr>
                                    <th>Predictive Model</th>
                                    <th>MAE</th>
                                    <th>RMSE</th>
                                    <th>Range hit rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(data.model_stats).map(
                                    ([name, s]) => {
                                        const isBest = name === data.best_model;
                                        const st = isBest ? bestStyle : {};
                                        return (
                                            <tr key={name}>
                                                <td style={st}>
                                                    {name}
                                                    {isBest ? " (in use)" : ""}
                                                </td>
                                                <td style={st}>{s.mae} mm</td>
                                                <td style={st}>{s.rmse} mm</td>
                                                <td style={st}>
                                                    {s.range_coverage_pct}%
                                                </td>
                                            </tr>
                                        );
                                    },
                                )}
                            </tbody>
                        </table>
                        <div className={styles.disclaimer}>
                            <strong>Note:</strong> Tested month by month on
                            years the models had not seen. Rainfall data is
                            satellite/reanalysis-based ({data.data_source}).
                            PAGASA's official forecasts remain the primary
                            reference.
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
                                    value={data.location}
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
                                onClick={() => setShowAdvice(true)}
                            >
                                Generate Advice
                            </button>
                        </div>

                        {showAdvice && (
                            <div className={styles.phonePreview}>
                                <div className={styles.phoneHeader}>
                                    <div className={styles.phoneAppTitle}>
                                        Messages (preview only, not sent)
                                    </div>
                                </div>
                                <div className={styles.phoneBody}>
                                    <div className={styles.smsBubble}>
                                        <div style={{ whiteSpace: "pre-line" }}>
                                            {sms}
                                        </div>
                                        <div className={styles.smsMeta}>
                                            <span>{sms.length} / 160 chars</span>
                                            <span className={styles.aiBadge}>
                                                Template message
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

                        <div className={styles.disclaimer}>
                            Risk rules use provisional water-need values
                            (rice {CROPS.Rice.needMm} mm/month, corn{" "}
                            {CROPS.Corn.needMm} mm/month), pending DA/PhilRice
                            or technician confirmation.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
