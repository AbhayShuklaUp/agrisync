# AgriSync

**Intelligent food systems for sustainable production and distribution.**

AgriSync is a hackathon prototype based on the [AgriSync pitch](https://github.com/AbhayShuklaUp/agrisync). It brings the pitch's four-layer model—**Sense, Decide, Act, Govern**—into a single, responsive dashboard for a sample food-supply network.

> **Honest scope:** This is a front-end pilot model, not a live agricultural service. Farm, sensor, yield, shipment, policy, carbon, and impact values are scenario data. There is no connected IoT hardware, satellite feed, trained AI model, carrier, government-policy feed, persistent database, or blockchain. The yield calculation is an explainable toy formula, subsidy prompts are not official eligibility decisions, and the lot trail is a stand-in record. Do not use these examples as agronomic, financial, or regulatory advice.

## What judges can try

1. Choose a pilot district: **Nashik, Anantapur, Mandya, or Wayanad**.
2. Open **Sense** to inspect the selected district's sample plot moisture, crop, yield estimate, and sensor status. Search and filter the farm records.
3. Open **Decide** and adjust rainfall, nitrogen, and irrigation sliders. The sample yield estimate updates using the formula shown on screen.
4. Open **Act** and use **Dispatch sample lot** or **Schedule water**. These actions update the demo UI only; no shipment or pump is controlled.
5. Open **Policy**, set the farm profile to **1.4 hectares** and **flood irrigation**, then search for lot **`AGR-NSK-2041`**.

## Run locally

The prototype uses static HTML, CSS, and JavaScript. No package installation or build step is required.

### Windows PowerShell

```powershell
cd C:\Users\dev28\agrisync
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in a browser. Stop the server with `Ctrl+C`. Alternatively, open `index.html` directly.

## Implementation

| File | Responsibility |
| --- | --- |
| `index.html` | Page structure, district selector, navigation, and accessibility labels |
| `styles.css` | Responsive dashboard, forms, charts, and mobile layouts |
| `app.js` | In-memory scenario data, the transparent yield calculation, navigation, search, policy prompts, and demo actions |

The current implementation is intentionally a self-contained, no-backend demo. Its decision screen uses:

```text
yield (t/ha) = 1.8 + (rainfall mm × 0.025)
                  + (nitrogen kg/ha × 0.018)
                  + (irrigation mm × 0.012)
```

The formula coefficients and baseline are illustrative, hand-set values—not a trained or validated crop model. The displayed carbon accounting and efficiency values are also illustrative.

## Roadmap from the pitch

1. **0–6 months — Pilot:** Select two districts, onboard farms and sensors, and establish measured baselines.
2. **6–12 months — Validate:** Evaluate yield models on local data, pilot provenance records, and integrate a checked scheme list.
3. **12–18 months — Expand:** Add districts, logistics partners, and farmer onboarding.
4. **18–24 months — Scale:** Consider state dashboards and open APIs after privacy, security, governance, and reliability reviews.

Production work would also need authenticated users, role-based access, a secure API and persistent database, consented device ingestion, independently validated agronomic models, verified policy sources, and an auditable provenance approach.

## Repository

- **GitHub:** [AbhayShuklaUp/agrisync](https://github.com/AbhayShuklaUp/agrisync)
- **Live app:** Not deployed yet.
- **Pitch deck:** AgriSync Hackathon Pitch.

Built for hackathon submission by **AbhayShuklaUp**.
