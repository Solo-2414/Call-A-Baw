// Call-A-Baw: turns the rainfall forecast (forecast.json) into a dry-spell
// risk level, a planting action, and an SMS-length message.
//
// IMPORTANT: the water-need numbers below are PROVISIONAL placeholders.
// They have NOT been confirmed by DA/PhilRice or a municipal agriculture
// technician. Show them in the app/video as "provisional, pending
// technician confirmation" until they are confirmed.

export const CROPS = {
    Rice: { en: "Rainfed Rice", fil: "Palay", needMm: 200 },
    Corn: { en: "Rainfed Corn", fil: "Mais", needMm: 100 },
};

// Risk thresholds (also provisional)
const HIGH_BELOW = 0.6; // expected rain < 60% of crop need OR < 60% of normal
const MEDIUM_NEED_BELOW = 1.0; // expected rain < 100% of crop need
const MEDIUM_NORMAL_BELOW = 0.85; // expected rain < 85% of normal

export const THRESHOLDS = {
    HIGH_BELOW,
    MEDIUM_NEED_BELOW,
    MEDIUM_NORMAL_BELOW,
};

const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

function classify(crop, ratioNeed, ratioNormal) {
    let risk = "LOW";
    if (ratioNeed < HIGH_BELOW || ratioNormal < HIGH_BELOW) risk = "HIGH";
    else if (ratioNeed < MEDIUM_NEED_BELOW || ratioNormal < MEDIUM_NORMAL_BELOW)
        risk = "MEDIUM";

    let action = "PLANT_NOW";
    if (risk === "MEDIUM") action = "WAIT";
    if (risk === "HIGH") action = crop === "Rice" ? "SWITCH_CROP" : "WAIT";
    return { risk, action };
}

/** Same rules applied to ONE forecast month (used for the month-by-month view). */
export function assessMonth(crop, m) {
    const need = CROPS[crop].needMm;
    return classify(crop, m.expected_mm / need, m.expected_mm / m.normal_mm);
}

/** Months that have not ended yet. */
export function upcomingMonths(forecast) {
    const thisMonth = new Date().toISOString().slice(0, 7);
    const up = forecast.filter((m) => m.month >= thisMonth);
    return up.length > 0 ? up : forecast;
}

/**
 * forecast = data.forecast from forecast.json (array of months)
 * Uses the first two upcoming forecast months. Returns a structured decision.
 * The decision comes ONLY from these fixed rules (no AI involved).
 */
export function assessRisk(crop, forecast) {
    const need = CROPS[crop].needMm;
    // Only use months that have not ended yet (the data lags by a few weeks,
    // so the first forecast month may already be in the past).
    const usable = upcomingMonths(forecast);
    const months = usable.slice(0, 2);
    const expected = avg(months.map((m) => m.expected_mm));
    const normal = avg(months.map((m) => m.normal_mm));
    const ratioNeed = expected / need;
    const ratioNormal = expected / normal;

    const { risk, action } = classify(crop, ratioNeed, ratioNormal);

    const next = usable[0];
    return {
        crop,
        risk,
        action,
        needMm: need,
        ratioNeed,
        ratioNormal,
        expectedMm: Math.round(expected),
        normalMm: Math.round(normal),
        nextMonth: next.label,
        lowMm: next.low_mm,
        highMm: next.high_mm,
        nextNormalMm: next.normal_mm,
    };
}

const ADVICE = {
    en: {
        PLANT_NOW: "Conditions look OK to plant now.",
        WAIT: "Wait for steady rain before planting.",
        SWITCH_CROP: "Consider a crop that needs less water.",
    },
    fil: {
        PLANT_NOW: "Maaari nang magtanim.",
        WAIT: "Hintayin muna ang tuloy-tuloy na ulan.",
        SWITCH_CROP: "Isaalang-alang ang tanim na kaunti ang kailangang tubig.",
    },
};

const RISK_WORD = {
    en: { LOW: "LOW", MEDIUM: "MEDIUM", HIGH: "HIGH" },
    fil: { LOW: "MABABA", MEDIUM: "KATAMTAMAN", HIGH: "MATAAS" },
};

/** Template message (fallback). Same structure for EN and Filipino. */
export function buildSms(result, lang = "en") {
    const crop = CROPS[result.crop];
    const range = `${result.lowMm}-${result.highMm}mm`;
    if (lang === "fil") {
        return [
            `CALL-A-BAW | ${crop.fil}`,
            `Peligro: ${RISK_WORD.fil[result.risk]}`,
            `Ulan sa ${result.nextMonth}: ${range} (karaniwan ${result.nextNormalMm}mm)`,
            ADVICE.fil[result.action],
            "Kumonsulta sa Agriculturist.",
        ].join("\n");
    }
    return [
        `CALL-A-BAW | ${crop.en}`,
        `Dry-spell risk: ${RISK_WORD.en[result.risk]}`,
        `Rain in ${result.nextMonth}: ${range} (normal ${result.nextNormalMm}mm)`,
        ADVICE.en[result.action],
        "Consult your Agriculturist.",
    ].join("\n");
}

export const RISK_STYLE = {
    LOW: { label: "Low Risk", icon: "iconPrimary", value: "valuePrimary" },
    MEDIUM: { label: "Medium Risk", icon: "iconWarning", value: "valueWarning" },
    HIGH: { label: "High Risk", icon: "iconDanger", value: "valueDanger" },
};

export const ACTION_SHORT = {
    PLANT_NOW: "Plant now",
    WAIT: "Wait for steady rain",
    SWITCH_CROP: "Choose lower-water crop",
};

export const ACTION_TEXT = {
    PLANT_NOW: "Action: Plant now",
    WAIT: "Action: Wait for steady rain",
    SWITCH_CROP: "Action: Choose a lower-water crop",
};
