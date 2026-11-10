"""
Call-A-Baw: monthly rainfall forecast for Alitagtag, Batangas (pilot area).

Compares two simple, explainable models on months they have NOT seen:
  1. Seasonal baseline  - average rainfall for that calendar month in past years
  2. El Nino analog     - average rainfall in past years that had a similar
                          Nino 3.4 (ONI) value at the same point in the year

Evaluation is walk-forward: to test year Y, models only see data before Y.
Only ONI values that would already be published at forecast time are used.

Run from the Call-A-Baw/backend folder:
    pip install pandas numpy
    python forecast.py

Output: ../frontend/public/forecast.json  (the React app reads this)
Data is cached in backend/data/ so you only download once.
"""
import calendar
import json
import urllib.request
from pathlib import Path

import numpy as np
import pandas as pd

# ---------------- settings ----------------
LOCATION = "Alitagtag, Batangas"
LAT, LON = 13.87, 121.00          # approximate municipal center
START_YEAR = 2001
FIRST_TEST_YEAR = 2012            # walk-forward testing starts here
HORIZONS = (1, 2, 3)              # months ahead
ONI_PUBLISH_LAG = 1               # ONI is a 3-month mean centered on month m,
                                  # so it is only known after month m+1 ends
K_ANALOGS = 5                     # number of similar past years to average
LOW_Q, HIGH_Q = 10, 90            # forecast range = 10th to 90th percentile

HERE = Path(__file__).parent
DATA = HERE / "data"
DATA.mkdir(exist_ok=True)
OUT = HERE.parent / "frontend" / "public" / "forecast.json"

SEASON_CENTER = {"DJF": 1, "JFM": 2, "FMA": 3, "MAM": 4, "AMJ": 5, "MJJ": 6,
                 "JJA": 7, "JAS": 8, "ASO": 9, "SON": 10, "OND": 11, "NDJ": 12}


# ---------------- data loading ----------------
def load_rain() -> pd.Series:
    """Monthly rainfall (mm/month) from NASA POWER (satellite/reanalysis)."""
    f = DATA / "rain.csv"
    if not f.exists():
        end_year = pd.Timestamp.today().year
        url = ("https://power.larc.nasa.gov/api/temporal/monthly/point"
               f"?parameters=PRECTOTCORR&community=AG&longitude={LON}&latitude={LAT}"
               f"&start={START_YEAR}&end={end_year}&format=JSON")
        print("Downloading rainfall from NASA POWER ...")
        with urllib.request.urlopen(url, timeout=90) as r:
            j = json.load(r)
        values = j["properties"]["parameter"]["PRECTOTCORR"]   # mm/day
        rows = []
        for key, mm_per_day in values.items():
            y, m = int(key[:4]), int(key[4:])
            if m < 1 or m > 12 or mm_per_day < 0:   # skips annual (13) and -999
                continue
            rows.append((pd.Timestamp(y, m, 1),
                         mm_per_day * calendar.monthrange(y, m)[1]))
        pd.DataFrame(rows, columns=["date", "rain_mm"]).sort_values("date") \
            .to_csv(f, index=False)
    s = pd.read_csv(f, parse_dates=["date"]).set_index("date")["rain_mm"]
    this_month = pd.Timestamp.today().normalize().replace(day=1)
    return s[s.index < this_month]          # drop the incomplete current month


def load_oni() -> pd.Series:
    """NOAA Oceanic Nino Index, indexed by the month the 3-month window centers on."""
    f = DATA / "oni.txt"
    if not f.exists():
        print("Downloading ONI from NOAA ...")
        urllib.request.urlretrieve(
            "https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt", f)
    rows = []
    for line in f.read_text().splitlines():
        p = line.split()
        if len(p) >= 4 and p[0] in SEASON_CENTER:
            rows.append((pd.Timestamp(int(p[1]), SEASON_CENTER[p[0]], 1), float(p[3])))
    return pd.Series(dict(rows)).sort_index()


# ---------------- models ----------------
def _range(values):
    v = np.asarray(values, dtype=float)
    return (float(np.mean(v)),
            float(np.percentile(v, LOW_Q)),
            float(np.percentile(v, HIGH_Q)))


def baseline(rain, cutoff, issue, h):
    target = issue + pd.DateOffset(months=h)
    past = rain[(rain.index < cutoff) & (rain.index.month == target.month)]
    if len(past) < 3:
        return None
    return _range(past.values)


def analog(rain, oni, cutoff, issue, h):
    now = issue - pd.DateOffset(months=ONI_PUBLISH_LAG)
    if now not in oni.index:
        return None
    cands = []
    for y in range(START_YEAR, cutoff.year + 1):
        a_issue = pd.Timestamp(y, issue.month, 1)
        a_target = a_issue + pd.DateOffset(months=h)
        a_oni = a_issue - pd.DateOffset(months=ONI_PUBLISH_LAG)
        if a_target < cutoff and a_target in rain.index and a_oni in oni.index:
            cands.append((abs(oni[a_oni] - oni[now]), rain[a_target]))
    if len(cands) < 3:
        return None
    cands.sort(key=lambda c: c[0])
    return _range([r for _, r in cands[:K_ANALOGS]])


MODELS = {"Seasonal baseline": lambda rain, oni, cut, i, h: baseline(rain, cut, i, h),
          "El Nino analog":    lambda rain, oni, cut, i, h: analog(rain, oni, cut, i, h)}


# ---------------- evaluation ----------------
def evaluate(rain, oni):
    rows = []
    last_year = rain.index.max().year
    for year in range(FIRST_TEST_YEAR, last_year + 1):
        cutoff = pd.Timestamp(year, 1, 1)           # models see only data before this
        for target in rain.index[rain.index.year == year]:
            for h in HORIZONS:
                issue = target - pd.DateOffset(months=h)
                for name, fn in MODELS.items():
                    out = fn(rain, oni, cutoff, issue, h)
                    if out:
                        mid, lo, hi = out
                        rows.append(dict(model=name, h=h, actual=rain[target],
                                         mid=mid, lo=lo, hi=hi))
    df = pd.DataFrame(rows)
    df["err"] = df.mid - df.actual
    df["inside"] = (df.actual >= df.lo) & (df.actual <= df.hi)
    stats = {}
    for name, g in df.groupby("model"):
        stats[name] = dict(
            mae=round(float(g.err.abs().mean()), 1),
            rmse=round(float(np.sqrt((g.err ** 2).mean())), 1),
            range_coverage_pct=round(float(g.inside.mean() * 100), 1),
            n_tests=int(len(g)),
            mae_by_horizon={int(h): round(float(x.err.abs().mean()), 1)
                            for h, x in g.groupby("h")})
    return stats


# ---------------- main ----------------
def main():
    rain, oni = load_rain(), load_oni()
    print(f"Rainfall: {rain.index.min():%b %Y} to {rain.index.max():%b %Y}")
    print(f"ONI:      {oni.index.min():%b %Y} to {oni.index.max():%b %Y}")

    stats = evaluate(rain, oni)
    best = min(stats, key=lambda k: stats[k]["mae"])
    print("\nWalk-forward results (mm/month, lower is better):")
    for name, s in stats.items():
        print(f"  {name:18s} MAE {s['mae']:6.1f}  RMSE {s['rmse']:6.1f}  "
              f"range coverage {s['range_coverage_pct']}%  (n={s['n_tests']})")
    print(f"Best by MAE: {best}")

    # issue month = latest month where rainfall is observed and ONI is published
    issue = rain.index.max()
    while (issue - pd.DateOffset(months=ONI_PUBLISH_LAG)) not in oni.index:
        issue -= pd.DateOffset(months=1)
    cutoff = pd.Timestamp(2100, 1, 1)               # use all history for the real forecast

    forecast = []
    for h in HORIZONS:
        target = issue + pd.DateOffset(months=h)
        mid, lo, hi = MODELS[best](rain, oni, cutoff, issue, h)
        normal = baseline(rain, cutoff, issue, h)[0]
        forecast.append(dict(month=f"{target:%Y-%m}", label=f"{target:%b %Y}",
                             low_mm=round(lo), expected_mm=round(mid),
                             high_mm=round(hi), normal_mm=round(normal)))

    result = dict(
        location=LOCATION, lat=LAT, lon=LON,
        data_source="NASA POWER PRECTOTCORR (satellite/reanalysis) + NOAA ONI",
        generated_on=f"{pd.Timestamp.today():%Y-%m-%d}",
        issue_month=f"{issue:%Y-%m}",
        latest_oni=float(oni[issue - pd.DateOffset(months=ONI_PUBLISH_LAG)]),
        best_model=best, model_stats=stats, forecast=forecast,
        note="Walk-forward test: models only saw data before each test year. "
             "PAGASA official forecasts remain the primary reference.")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, indent=2))
    print(f"\nIssue month: {issue:%b %Y}")
    for f_ in forecast:
        print(f"  {f_['label']}: {f_['low_mm']}-{f_['high_mm']} mm "
              f"(expected {f_['expected_mm']}, normal {f_['normal_mm']})")
    print(f"\nSaved {OUT}")


if __name__ == "__main__":
    main()