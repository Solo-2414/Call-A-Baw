import { Chart } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    LineController,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import { CROPS, assessMonth, upcomingMonths } from "../risk";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    LineController,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
);

const RISK_HEX = { LOW: "#2e7d32", MEDIUM: "#ef6c00", HIGH: "#d32f2f" };

/**
 * forecast   : data.forecast from forecast.json
 * needCrops  : crops whose (provisional) water-need line should be drawn
 * riskCrop   : if set, each expected-rainfall dot is colored by that crop's
 *              risk for that month (green / orange / red). Grey = past month.
 */
export default function ForecastChart({
    forecast,
    needCrops = [],
    riskCrop = null,
}) {
    const upcoming = new Set(upcomingMonths(forecast).map((m) => m.month));
    const isUpcoming = (f) => upcoming.has(f.month);

    const labels = forecast.map((f) =>
        isUpcoming(f) ? f.label : `${f.label} (past)`,
    );
    const dotColors = forecast.map((f) => {
        if (!isUpcoming(f)) return "#90a4ae";
        return riskCrop
            ? RISK_HEX[assessMonth(riskCrop, f).risk]
            : "#0277bd";
    });

    const datasets = [
        {
            type: "bar",
            label: "Likely range (10th to 90th percentile)",
            data: forecast.map((f) => [f.low_mm, f.high_mm]),
            backgroundColor: forecast.map((f) =>
                isUpcoming(f)
                    ? "rgba(79, 195, 247, 0.35)"
                    : "rgba(176, 190, 197, 0.35)",
            ),
            borderColor: "rgba(2, 119, 189, 0.5)",
            borderWidth: 1,
            borderRadius: 8,
            barPercentage: 0.45,
            order: 3,
        },
        {
            type: "line",
            label: "Expected rainfall",
            data: forecast.map((f) => f.expected_mm),
            borderColor: "#0277bd",
            backgroundColor: "#0277bd",
            pointBackgroundColor: dotColors,
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 8,
            pointHoverRadius: 10,
            borderWidth: 2,
            tension: 0.3,
            order: 1,
        },
        {
            type: "line",
            label: "Seasonal average of past years",
            data: forecast.map((f) => f.normal_mm),
            borderColor: "#546e7a",
            borderDash: [6, 6],
            pointRadius: 0,
            borderWidth: 1.5,
            tension: 0.3,
            order: 2,
        },
    ];

    needCrops.forEach((c) =>
        datasets.push({
            type: "line",
            label: `${CROPS[c].en} need, provisional (${CROPS[c].needMm} mm)`,
            data: forecast.map(() => CROPS[c].needMm),
            borderColor: c === "Rice" ? "#2e7d32" : "#f9a825",
            borderDash: [2, 4],
            pointRadius: 0,
            borderWidth: 2,
            order: 2,
        }),
    );

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    boxWidth: 10,
                    font: { family: "'Inter', sans-serif" },
                },
            },
            tooltip: {
                callbacks: {
                    label: (ctx) =>
                        ctx.dataset.type === "bar"
                            ? `Likely range: ${ctx.raw[0]} to ${ctx.raw[1]} mm`
                            : `${ctx.dataset.label}: ${Math.round(ctx.parsed.y)} mm`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: "Rainfall (mm per month)" },
                grid: { color: "#eceff1" },
            },
            x: { grid: { display: false } },
        },
    };

    return (
        <div>
            <div style={{ height: "340px" }}>
                <Chart type="bar" data={{ labels, datasets }} options={options} />
            </div>
            <p
                style={{
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    margin: "10px 0 0",
                }}
            >
                {riskCrop
                    ? `Dot color = ${CROPS[riskCrop].en} risk for that month (green low, orange medium, red high). `
                    : ""}
                Grey = month already ended. Satellite-based estimate; PAGASA
                remains the primary reference.
            </p>
        </div>
    );
}
