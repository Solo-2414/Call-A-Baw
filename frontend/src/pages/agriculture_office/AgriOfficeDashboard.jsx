import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./AgriOfficeDashboard.module.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

const MOCK_KPIS = [
    {
        id: 1,
        label: "Total Farmers",
        value: "1,245",
        styleClass: styles.cardSecondary,
        iconPath:
            "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    },
    {
        id: 2,
        label: "Favorable Areas",
        value: "2 Brgy",
        styleClass: styles.cardPrimary,
        iconPath: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    },
    {
        id: 3,
        label: "High Risk Areas",
        value: "5 Brgy",
        styleClass: styles.cardDanger,
        iconPath:
            "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
    },
    {
        id: 4,
        label: "Pending Thresholds",
        value: "3",
        styleClass: styles.cardAccent,
        iconPath:
            "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    },
];

const MOCK_TABLE_DATA = [
    {
        id: 1,
        crop: "Rainfed Rice",
        statusText: "Pending Technician Review",
        statusColor: "var(--text-muted)",
        m1: { text: "Delay Planting", class: styles.statusHigh },
        m2: { text: "Delay Planting", class: styles.statusHigh },
        m3: { text: "Monitor Closely", class: styles.statusMedium },
    },
    {
        id: 2,
        crop: "Rainfed Corn",
        statusText: "Confirmed (DA Baseline)",
        statusColor: "var(--primary)",
        m1: { text: "Assess Moisture", class: styles.statusMedium },
        m2: { text: "Delay Planting", class: styles.statusHigh },
        m3: { text: "Favorable Window", class: styles.statusLow },
    },
];

const CHART_DATA = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
        {
            label: "Forecasted Rainfall (mm)",
            data: [120, 85, 45, 60],
            borderColor: "#4fc3f7",
            backgroundColor: "#4fc3f7",
            tension: 0.4,
        },
        {
            label: "Rice Min Requirement",
            data: [200, 200, 200, 200],
            borderColor: "#2e7d32",
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
        },
        {
            label: "Corn Min Requirement",
            data: [100, 100, 100, 100],
            borderColor: "#f9a825",
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
        },
    ],
};

const CHART_OPTIONS = {
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

export default function AgriOfficeDashboard() {
    return (
        <div className={styles.dashboard}>
            <div className={styles.headerRow}>
                <h1 className={styles.pageTitle}>Pilot Area Overview</h1>
                <button className={styles.filterBtn}>
                    <svg
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                    </svg>
                    Filter by Crop
                </button>
            </div>

            <div className={styles.kpiGrid}>
                {MOCK_KPIS.map((kpi) => (
                    <div
                        key={kpi.id}
                        className={`${styles.kpiCard} ${kpi.styleClass}`}
                    >
                        <div className={styles.kpiIcon}>
                            <svg
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d={kpi.iconPath}></path>
                            </svg>
                        </div>
                        <div className={styles.kpiInfo}>
                            <span className={styles.kpiLabel}>{kpi.label}</span>
                            <span className={styles.kpiValue}>{kpi.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.chartSection}>
                <h3 className={styles.sectionTitle}>
                    Monthly Rainfall Trends vs. Crop Requirements
                </h3>
                <div className={styles.chartContainer}>
                    <Line data={CHART_DATA} options={CHART_OPTIONS} />
                </div>
            </div>

            <div className={styles.tableSection}>
                <h2>System Activity Summary & Validation</h2>
                <div className={styles.tableContainer}>
                    <table className={styles.dataGrid}>
                        <thead>
                            <tr>
                                <th>Crop Type</th>
                                <th>Validation Status</th>
                                <th>Month 1 Action</th>
                                <th>Month 2 Action</th>
                                <th>Month 3 Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_TABLE_DATA.map((row) => (
                                <tr key={row.id}>
                                    <td
                                        style={{
                                            color: "var(--text-main)",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {row.crop}
                                    </td>
                                    <td style={{ color: row.statusColor }}>
                                        {row.statusText}
                                    </td>
                                    <td className={row.m1.class}>
                                        {row.m1.text}
                                    </td>
                                    <td className={row.m2.class}>
                                        {row.m2.text}
                                    </td>
                                    <td className={row.m3.class}>
                                        {row.m3.text}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
