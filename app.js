const farms = [
  { name: "Green Valley Farm", district: "Nashik", location: "Nashik, Maharashtra", crop: "🍇", cropName: "Grapes", area: "24.5 ha", sensor: "Healthy", moisture: "62%", yield: "18.2 t", updated: "2 min ago" },
  { name: "Sunrise Organics", district: "Nashik", location: "Nashik, Maharashtra", crop: "🌾", cropName: "Wheat", area: "18.0 ha", sensor: "Healthy", moisture: "58%", yield: "12.8 t", updated: "8 min ago" },
  { name: "Riverbend Co-op", district: "Anantapur", location: "Anantapur, Andhra Pradesh", crop: "🍅", cropName: "Tomato", area: "31.2 ha", sensor: "Attention", moisture: "34%", yield: "21.4 t", updated: "4 min ago" },
  { name: "Meadow Fresh", district: "Mandya", location: "Mandya, Karnataka", crop: "🧅", cropName: "Onion", area: "15.7 ha", sensor: "Healthy", moisture: "55%", yield: "9.6 t", updated: "12 min ago" },
  { name: "Hilltop Produce", district: "Wayanad", location: "Wayanad, Kerala", crop: "🌱", cropName: "Soybean", area: "28.1 ha", sensor: "Syncing", moisture: "—", yield: "16.1 t", updated: "1 hr ago" },
];

const batches = [
  { id: "AGR-NSK-2041", crop: "Organic grapes", farm: "Green Valley Farm", origin: "Nashik, Maharashtra", quantity: "2,400 kg", status: "In transit", destination: "FreshMart Distribution, Mumbai" },
  { id: "AG-2025-0839", crop: "Wheat", farm: "Sunrise Organics", origin: "Pune, Maharashtra", quantity: "8,000 kg", status: "Delivered", destination: "Harvest Foods, Pune" },
  { id: "AG-2025-0837", crop: "Tomatoes", farm: "Riverbend Co-op", origin: "Kolhapur, Maharashtra", quantity: "1,200 kg", status: "In transit", destination: "City Market, Mumbai" },
];

const pageContent = document.querySelector("#page-content");
const breadcrumbCurrent = document.querySelector("#breadcrumb-current");
let activePage = "overview";
let selectedDistrict = "Nashik";
let irrigationScheduled = false;
let lotDispatched = false;
let toastTimer;

const icons = {
  leaf: '<svg viewBox="0 0 24 24"><path d="M20 4c-8.5 0-14 3.5-14 10a5 5 0 0 0 5 5c6.5 0 9-6 9-15Z"/><path d="M4 21c2.5-5 6-8 11-11"/></svg>',
  water: '<svg viewBox="0 0 24 24"><path d="M12 3s7 7.2 7 12a7 7 0 1 1-14 0c0-4.8 7-12 7-12Z"/><path d="M9 16a3 3 0 0 0 3 3"/></svg>',
  box: '<svg viewBox="0 0 24 24"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12v9M8 5.2l8 4.6"/></svg>',
  co2: '<svg viewBox="0 0 24 24"><path d="M7.5 17.5a4.5 4.5 0 1 1 2.6-8.2A5.5 5.5 0 1 1 18 17.5Z"/><path d="M8.5 14h3M8.5 14a1.5 1.5 0 1 0 0-3h-.4M15.5 11h-2v6h2M13.5 14h1.7"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>',
  filter: '<svg viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></svg>',
  calendar: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M7.5 3v4M16.5 3v4M3.5 9h17"/></svg>',
};

const farmsTable = (rows, includeUpdated = false) => `
  <div class="table-scroll"><table>
    <thead><tr><th>FARM / LOCATION</th><th>CROP</th><th>AREA</th><th>SOIL MOISTURE</th><th>YIELD FORECAST</th><th>SENSOR STATUS</th>${includeUpdated ? "<th>LAST SYNC</th>" : ""}</tr></thead>
    <tbody>${rows.length ? rows.map((farm) => `<tr>
      <td><div class="farm-cell"><span class="crop-thumb">${farm.crop}</span><span>${farm.name}<span class="farm-sub">${farm.location}</span></span></div></td>
      <td>${farm.cropName}</td><td>${farm.area}</td><td>${farm.moisture}</td><td><strong>${farm.yield}</strong></td>
      <td><span class="status ${farm.sensor === "Attention" ? "warning" : farm.sensor === "Syncing" ? "neutral" : ""}">${farm.sensor}</span></td>
      ${includeUpdated ? `<td>${farm.updated}</td>` : ""}
    </tr>`).join("") : '<tr><td colspan="7"><div class="empty-state">No farms match your search.</div></td></tr>'}</tbody>
  </table></div>`;

const pageHeading = (eyebrow, title, subtitle, action = "") => `
  <div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="subtitle">${subtitle}</p></div>${action}</div>`;

function renderOverview() {
  return `${pageHeading("Saturday, October 10, 2026", "Good morning, team 👋", `Here’s the sample network view for ${selectedDistrict}. Select another pilot district above.`, `<button class="date-control">${icons.calendar} Oct 04 – Oct 10, 2026</button>`)}
    <div class="metrics-grid">
      <article class="metric-card"><div class="metric-top"><span>Connected farms</span><span class="metric-icon">${icons.leaf}</span></div><div class="metric-value">1,284</div><div class="metric-trend"><span class="trend-up">↑ 12.8%</span> <span>vs. last season</span></div></article>
      <article class="metric-card"><div class="metric-top"><span>Produce tracked</span><span class="metric-icon">${icons.box}</span></div><div class="metric-value">8,642 <small style="font:500 11px 'DM Sans';color:#879188">tonnes</small></div><div class="metric-trend"><span class="trend-up">↑ 8.2%</span> <span>this month</span></div></article>
      <article class="metric-card"><div class="metric-top"><span>Water saved</span><span class="metric-icon">${icons.water}</span></div><div class="metric-value">24.6%</div><div class="metric-trend"><span class="trend-up">↑ 3.1%</span> <span>vs. baseline estimate</span></div></article>
      <article class="metric-card"><div class="metric-top"><span>Food loss avoided</span><span class="metric-icon">${icons.co2}</span></div><div class="metric-value">186 <small style="font:500 11px 'DM Sans';color:#879188">tonnes</small></div><div class="metric-trend"><span class="trend-down">↓ 18.4%</span> <span>estimated loss rate</span></div></article>
    </div>
    <div class="dashboard-grid">
      <section class="panel">
        <div class="panel-heading"><div><h2>Yield outlook</h2><p>Seasonal forecast across connected farms</p></div><div class="chart-legend"><span><i class="legend-mark"></i>Forecast</span><span><i class="legend-mark light"></i>Last season</span></div></div>
        <div class="yield-chart" role="img" aria-label="Illustrative yield outlook chart comparing this season and last season">
          <svg viewBox="0 0 540 160" preserveAspectRatio="none">
            <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#75a579" stop-opacity=".19"/><stop offset="100%" stop-color="#75a579" stop-opacity="0"/></linearGradient></defs>
            <line class="chart-gridline" x1="35" y1="20" x2="530" y2="20"/><line class="chart-gridline" x1="35" y1="55" x2="530" y2="55"/><line class="chart-gridline" x1="35" y1="90" x2="530" y2="90"/><line class="chart-gridline" x1="35" y1="125" x2="530" y2="125"/>
            <text class="chart-label" x="0" y="23">24t</text><text class="chart-label" x="0" y="58">18t</text><text class="chart-label" x="0" y="93">12t</text><text class="chart-label" x="4" y="128">6t</text>
            <path class="chart-area" d="M40 118 C72 111 83 100 111 105 S157 95 181 91 S227 80 252 86 S295 69 321 70 S363 60 390 65 S431 49 457 53 S495 37 525 35 V132 H40Z"/>
            <path class="chart-line-muted" d="M40 124 C70 119 86 109 111 112 S154 104 181 101 S225 92 252 97 S294 85 321 87 S365 76 390 80 S429 67 457 71 S498 58 525 57"/>
            <path class="chart-line" d="M40 118 C72 111 83 100 111 105 S157 95 181 91 S227 80 252 86 S295 69 321 70 S363 60 390 65 S431 49 457 53 S495 37 525 35"/>
            <circle class="chart-dot" cx="525" cy="35" r="4"/><rect x="476" y="10" width="48" height="18" rx="5" fill="#edf5ec"/><text class="chart-callout" x="484" y="22">+14.2%</text>
            <text class="chart-label" x="35" y="151">Wk 1</text><text class="chart-label" x="125" y="151">Wk 4</text><text class="chart-label" x="222" y="151">Wk 7</text><text class="chart-label" x="318" y="151">Wk 10</text><text class="chart-label" x="412" y="151">Wk 13</text><text class="chart-label" x="498" y="151">Wk 16</text>
          </svg>
        </div>
        <div class="chart-caption">Illustrative forecast based on sample sensor readings · Not a validated model</div>
      </section>
      <section class="panel">
        <div class="panel-heading"><div><h2>Needs attention</h2><p>Signals from across the network</p></div><button class="text-button" data-page="farms">View all</button></div>
        <div class="alert-list">
          <div class="alert-row"><span class="alert-symbol">!</span><div class="alert-copy"><strong>Low soil moisture detected</strong><span>Riverbend Co-op · Tomato fields</span></div><span class="alert-time">12 min ago</span></div>
          <div class="alert-row"><span class="alert-symbol red">⌁</span><div class="alert-copy"><strong>Cold-chain temperature variance</strong><span>Shipment AGR-NSK-2041 · 8.7°C</span></div><span class="alert-time">38 min ago</span></div>
          <div class="alert-row"><span class="alert-symbol green">✓</span><div class="alert-copy"><strong>Compliance checklist ready</strong><span>Sunrise Organics · Export batch</span></div><span class="alert-time">1 hr ago</span></div>
        </div>
      </section>
    </div>
    <section class="panel table-panel">
      <div class="panel-heading"><div><h2>Farm network</h2><p>Live status from your connected farms</p></div><div class="table-tools"><label class="search-box">${icons.search}<input id="farm-search" type="search" placeholder="Search farms..." aria-label="Search farms"></label><button class="filter-button" id="farm-filter">${icons.filter} All farms</button><button class="text-button" data-page="farms">View network →</button></div></div>
      ${farmsTable(farms.filter((farm) => farm.district === selectedDistrict))}
      <div class="table-footer"><span>Showing sample farms in ${selectedDistrict}</span><button class="table-link" data-page="farms">View farm signals →</button></div>
    </section>`;
}

function renderFarms() {
  const districtFarms = farms.filter((farm) => farm.district === selectedDistrict);
  const healthySensors = districtFarms.filter((farm) => farm.sensor === "Healthy").length;
  const needsAttention = districtFarms.filter((farm) => farm.sensor === "Attention").length;
  return `${pageHeading("01 · Sense layer", `${selectedDistrict} field signals`, "Inspect sample plot moisture, sensor health, and indicative yield outlook in the selected pilot district.", `<button class="primary-button" data-toast="Farm onboarding is a prototype workflow.">+ Add a farm</button>`)}
    <div class="metrics-grid">
      <article class="metric-card"><div class="metric-top"><span>Sample plots</span><span class="metric-icon">${icons.leaf}</span></div><div class="metric-value">${districtFarms.length}</div><div class="metric-trend">In ${selectedDistrict} · demo records</div></article>
      <article class="metric-card"><div class="metric-top"><span>Healthy sensors</span><span class="metric-icon">${icons.water}</span></div><div class="metric-value">${districtFarms.length ? Math.round(healthySensors / districtFarms.length * 100) : 0}%</div><div class="metric-trend"><span class="trend-up">${healthySensors} of ${districtFarms.length}</span> <span>sample sensors normal</span></div></article>
      <article class="metric-card"><div class="metric-top"><span>Need attention</span><span class="metric-icon">!</span></div><div class="metric-value">${needsAttention}</div><div class="metric-trend">Sample moisture or device alerts</div></article>
      <article class="metric-card"><div class="metric-top"><span>Active crops</span><span class="metric-icon">${icons.leaf}</span></div><div class="metric-value">${new Set(districtFarms.map((farm) => farm.cropName)).size}</div><div class="metric-trend">Represented in demo records</div></article>
    </div>
    <section class="panel data-panel table-panel">
      <div class="panel-heading"><div><h2>Connected farm network</h2><p>Sample readings; live sensor integration is not configured.</p></div><div class="farm-toolbar"><label class="search-box">${icons.search}<input id="farm-search" type="search" placeholder="Search farms..." aria-label="Search farms"></label><button class="filter-button" id="farm-filter">${icons.filter} All farms</button></div></div>
      ${farmsTable(farms.filter((farm) => farm.district === selectedDistrict), true)}
      <div class="table-footer"><span>Showing sample farm records for ${selectedDistrict}</span><span>Demo data</span></div>
    </section>`;
}

function renderDecide() {
  return `${pageHeading("02 · Decide layer", "Yield scenario", `Explore how rainfall, nitrogen, and irrigation inputs change a transparent sample yield estimate for ${selectedDistrict}.`)}
    <div class="decision-layout">
      <section class="panel decision-controls">
        <div class="panel-heading"><div><h2>Adjust field inputs</h2><p>Use the sliders to explore a what-if scenario.</p></div><span class="status neutral">Scenario only</span></div>
        <label class="range-control"><span><strong>Season rainfall</strong><output id="rainfall-value">80 mm</output></span><input id="rainfall-input" type="range" min="0" max="160" step="5" value="80"></label>
        <label class="range-control"><span><strong>Nitrogen applied</strong><output id="nitrogen-value">65 kg/ha</output></span><input id="nitrogen-input" type="range" min="0" max="120" step="5" value="65"></label>
        <label class="range-control"><span><strong>Supplemental irrigation</strong><output id="irrigation-value">40 mm</output></span><input id="irrigation-input" type="range" min="0" max="100" step="5" value="40"></label>
        <div class="formula-note"><strong>Readable demo formula</strong><code>1.8 + (rainfall × 0.025) + (nitrogen × 0.018) + (irrigation × 0.012)</code><span>Output is illustrative tonnes per hectare—not an agronomic recommendation.</span></div>
      </section>
      <section class="panel forecast-card">
        <span class="eyebrow">SAMPLE FORECAST · ${selectedDistrict.toUpperCase()}</span>
        <div class="forecast-value"><span id="yield-forecast">5.5</span><small>t/ha</small></div>
        <p>Indicative yield for the selected input scenario</p>
        <div class="forecast-divider"></div>
        <div class="forecast-comparison"><span>Sample baseline</span><strong>4.8 t/ha</strong></div>
        <div class="forecast-comparison"><span>Scenario vs. baseline</span><strong id="yield-delta">+0.7 t/ha</strong></div>
        <div class="recommendation-note" id="decision-recommendation">Adjust the inputs to explore a different scenario. Always validate advice with local agronomists.</div>
      </section>
    </div>
    <div class="chart-caption" style="margin-top:14px">The coefficients are hand-set demo values to make the calculation explainable. This is not a trained or validated AI/ML yield model.</div>`;
}

function renderLogistics() {
  return `${pageHeading("03 · Act layer", "Dispatch & irrigation", `Plan a sample dispatch or irrigation action. Irrigation follows the selected ${selectedDistrict} pilot; routes are illustrative.`, `<div class="farm-toolbar"><button class="filter-button" data-action="irrigate">${irrigationScheduled ? "✓ Irrigation scheduled" : "Schedule water"}</button><button class="primary-button" data-action="dispatch">${lotDispatched ? "✓ Lot dispatched" : "Dispatch sample lot"}</button></div>`)}
    <div class="metrics-grid">
      <article class="metric-card"><div class="metric-top"><span>Active shipments</span><span class="metric-icon">${icons.box}</span></div><div class="metric-value">38</div><div class="metric-trend">Across 6 sample routes</div></article>
      <article class="metric-card"><div class="metric-top"><span>On-time delivery</span><span class="metric-icon">↗</span></div><div class="metric-value">94.2%</div><div class="metric-trend">Illustrative network estimate</div></article>
      <article class="metric-card"><div class="metric-top"><span>Cold-chain alerts</span><span class="metric-icon">⌁</span></div><div class="metric-value">3</div><div class="metric-trend"><span class="trend-down">1 needs action</span> <span>sample alert</span></div></article>
      <article class="metric-card"><div class="metric-top"><span>Food loss avoided</span><span class="metric-icon">${icons.leaf}</span></div><div class="metric-value">186 t</div><div class="metric-trend">Estimated · sample data</div></article>
    </div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-heading"><div><h2>Active routes</h2><p>Shipment status across the sample network</p></div><button class="text-button" data-toast="Route optimization is represented with sample data.">Optimize routes</button></div>
        <div class="route-list" style="margin-top:14px">
          <div class="route-card"><span class="route-icon">🚚</span><div class="route-copy"><strong>Nashik → Mumbai</strong><span>AGR-NSK-2041 · Grapes · MH-15-AX-2041</span></div><span class="route-value">${lotDispatched ? "Dispatched" : "Ready to dispatch"}<small>Sample route · ETA 4:30 PM</small></span></div>
          <div class="route-card"><span class="route-icon">🚚</span><div class="route-copy"><strong>Pune → Pune Central</strong><span>AG-2025-0839 · Wheat · MH-12-BQ-7730</span></div><span class="route-value">Delivered<small>Today, 11:12 AM</small></span></div>
          <div class="route-card"><span class="route-icon">🚚</span><div class="route-copy"><strong>Kolhapur → Mumbai</strong><span>AG-2025-0837 · Tomatoes · MH-09-CK-1198</span></div><span class="route-value">At checkpoint<small>ETA 6:10 PM</small></span></div>
        </div>
      </section>
      <section class="panel"><div class="panel-heading"><div><h2>Cold-chain health</h2><p>Sample temperature checks</p></div></div>
        <div class="alert-list">
          <div class="alert-row"><span class="alert-symbol red">!</span><div class="alert-copy"><strong>AGR-NSK-2041 · 8.7°C</strong><span>Above the sample 2–8°C range</span></div><span class="alert-time">38m</span></div>
          <div class="alert-row"><span class="alert-symbol green">✓</span><div class="alert-copy"><strong>AG-2025-0837 · 5.1°C</strong><span>Within the sample range</span></div><span class="alert-time">1h</span></div>
          <div class="alert-row"><span class="alert-symbol green">✓</span><div class="alert-copy"><strong>AG-2025-0839 · 4.4°C</strong><span>Delivered · sample reading</span></div><span class="alert-time">2h</span></div>
        </div>
      </section>
    </div>
    <div class="policy-banner" style="margin-top:15px"><span class="policy-mark">${irrigationScheduled ? "✓" : "↗"}</span><div><h2>${irrigationScheduled ? "Sample irrigation scheduled" : "Water scheduling"}</h2><p>${irrigationScheduled ? `A demo irrigation event has been added for ${selectedDistrict}.` : "The scheduling control records a demo action only; no pump or irrigation controller is connected."}</p></div></div>
    <div class="chart-caption">Routes, vehicle locations, temperature readings, and savings are sample data; no GPS, carrier, or IoT service is connected.</div>`;
}

function renderPolicy() {
  const batch = batches[0];
  return `${pageHeading("04 · Govern layer", "Policy & lot lookup", "Explore a sample farm profile, indicative scheme prompts, and produce traceability for the selected pilot district.", `<button class="primary-button" data-toast="Policy feeds are not configured; records shown are examples.">Explore policies</button>`)}
    <div class="policy-banner"><span class="policy-mark">✓</span><div><h2>Compliance snapshot</h2><p>Example checklist state for the demo farms. Requirements vary by crop, market, and jurisdiction.</p></div><button class="text-button" data-toast="This prototype has no connected regulatory data feed.">Review checklist →</button></div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-heading"><div><h2>Farm profile &amp; scheme prompts</h2><p>Explore an illustrative profile—this does not determine eligibility.</p></div><span class="status neutral">Example only</span></div>
        <form class="profile-form" id="subsidy-form">
          <label>Land area (hectares)<input id="profile-area" type="number" min="0.1" max="1000" step="0.1" value="1.4" required></label>
          <label>Irrigation method<select id="profile-irrigation"><option value="flood">Flood irrigation</option><option value="drip">Drip irrigation</option><option value="sprinkler">Sprinkler</option></select></label>
        </form>
        <div class="match-result" id="scheme-match" role="status">Potential topic to explore: micro-irrigation transition support. This is not an official scheme or eligibility decision.</div>
        <div class="chart-caption" style="margin-top:11px">Confirm current programs and requirements with the relevant government department.</div>
      </section>
      <section class="panel"><div class="panel-heading"><div><h2>Trace a produce lot</h2><p>Search the sample farm-to-market event trail</p></div><span class="status neutral">Demo records</span></div>
        <form class="batch-lookup" id="policy-lot-form"><input id="policy-lot-id" type="search" value="${batch.id}" aria-label="Lot ID" placeholder="Enter lot ID"><button class="primary-button" type="submit">Search lot</button></form>
        <div class="lot-result" id="policy-lot-result" role="status"><strong>${batch.id} · ${batch.crop}</strong><span>${batch.farm} → ${batch.destination}</span><small>${batch.quantity} · ${batch.status} · Sample provenance record</small></div>
        <div class="chart-caption" style="margin-top:12px">This record is illustrative and is not stored on a blockchain.</div>
      </section>
    </div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-heading"><div><h2>Compliance checklist</h2><p>Illustrative sample export documentation</p></div><span class="status">2 ready</span></div>
        <div class="compliance-list" style="margin-top:12px">
          <div class="compliance-row"><span>Farm origin records</span><span>Green Valley Farm</span><span class="status">Ready</span></div>
          <div class="compliance-row"><span>Produce quality check</span><span>Lot AGR-NSK-2041</span><span class="status">Ready</span></div>
          <div class="compliance-row"><span>Cold-chain evidence</span><span>Lot AGR-NSK-2041</span><span class="status warning">Review</span></div>
          <div class="compliance-row"><span>Export certificate</span><span>Not connected</span><span class="status neutral">Pending</span></div>
        </div>
        <div class="chart-caption">This is a product concept only, not legal or regulatory advice.</div>
      </section>
      <section class="panel"><div class="panel-heading"><div><h2>Carbon ledger</h2><p>Illustrative emissions by activity</p></div></div>
        <div class="info-value" style="margin-top:22px">1,248 <small>tCO₂e sample estimate</small></div>
        <div class="carbon-bars">
          <div class="carbon-row"><span>Production</span><div class="carbon-track"><div class="carbon-fill" style="width:72%"></div></div><strong>720 t</strong></div>
          <div class="carbon-row"><span>Transport</span><div class="carbon-track"><div class="carbon-fill orange" style="width:38%"></div></div><strong>380 t</strong></div>
          <div class="carbon-row"><span>Storage</span><div class="carbon-track"><div class="carbon-fill blue" style="width:15%"></div></div><strong>148 t</strong></div>
        </div>
        <div class="chart-caption" style="margin-top:16px">No verified emissions factors or primary data sources connected.</div>
      </section>
    </div>
    <div class="section-grid" style="margin-top:15px">
      <article class="info-card"><div class="info-card-top"><span class="info-icon">🎯</span><span class="status neutral">Demo</span></div><h3>Subsidy matching</h3><p>Profile-based scheme prompts only. No government programs or eligibility rules are connected.</p></article>
      <article class="info-card"><div class="info-card-top"><span class="info-icon">🌿</span><span class="status neutral">Estimate</span></div><h3>Resource efficiency</h3><p>24.6% estimated water saved against a sample baseline; this value is not independently measured.</p></article>
      <article class="info-card"><div class="info-card-top"><span class="info-icon">📋</span><span class="status neutral">Roadmap</span></div><h3>Policy simulation</h3><p>Digital-twin simulations and live policy ingestion are future work—not included in this static-data MVP.</p></article>
    </div>`;
}

const renderers = { overview: renderOverview, farms: renderFarms, decide: renderDecide, logistics: renderLogistics, policy: renderPolicy };
const pageTitles = { overview: "Overview", farms: "Sense", decide: "Decide", logistics: "Act", policy: "Policy" };

function render(page = activePage) {
  activePage = page;
  breadcrumbCurrent.textContent = pageTitles[page];
  pageContent.innerHTML = renderers[page]();
  document.querySelectorAll(".nav-item").forEach((button) => {
    const selected = button.dataset.page === page;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-current", selected ? "page" : "false");
  });
  bindPageInteractions();
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

function updateFarmTable() {
  const search = document.querySelector("#farm-search");
  const filter = document.querySelector("#farm-filter");
  const query = search?.value.trim().toLowerCase() || "";
  const attentionOnly = filter?.dataset.attention === "true";
  const filtered = farms.filter((farm) =>
    farm.district === selectedDistrict
    && `${farm.name} ${farm.location} ${farm.cropName}`.toLowerCase().includes(query)
    && (!attentionOnly || farm.sensor === "Attention"),
  );
  const table = pageContent.querySelector("table");
  if (!table) return;
  const replacement = document.createElement("div");
  replacement.innerHTML = farmsTable(activePage === "farms" ? filtered : filtered.slice(0, 4), activePage === "farms");
  table.parentElement.replaceWith(replacement.firstElementChild);
}

function bindPageInteractions() {
  pageContent.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => render(button.dataset.page));
  });
  document.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.toast));
  });
  const search = document.querySelector("#farm-search");
  if (search) search.addEventListener("input", updateFarmTable);
  const filter = document.querySelector("#farm-filter");
  if (filter) {
    filter.addEventListener("click", () => {
      const attentionOnly = filter.dataset.attention === "true";
      filter.dataset.attention = String(!attentionOnly);
      filter.innerHTML = `${icons.filter} ${attentionOnly ? "All farms" : "Needs attention"}`;
      updateFarmTable();
    });
  }
  const policyLotForm = document.querySelector("#policy-lot-form");
  if (policyLotForm) policyLotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const requestedId = document.querySelector("#policy-lot-id").value.trim().toUpperCase();
    const found = batches.find((batch) => batch.id === requestedId);
    const result = document.querySelector("#policy-lot-result");
    if (!found) {
      result.textContent = "Lot not found. Try AGR-NSK-2041 or one of the sample AG-2025 lot IDs.";
      return;
    }
    result.innerHTML = `<strong>${found.id} · ${found.crop}</strong><span>${found.farm} → ${found.destination}</span><small>${found.quantity} · ${found.status} · Sample provenance record</small>`;
  });
  const subsidyForm = document.querySelector("#subsidy-form");
  if (subsidyForm) {
    const updateSchemePrompt = () => {
      const area = Number(document.querySelector("#profile-area").value);
      const irrigation = document.querySelector("#profile-irrigation").value;
      const match = document.querySelector("#scheme-match");
      if (!Number.isFinite(area) || area <= 0) {
        match.textContent = "Enter a land area greater than zero to explore sample policy prompts.";
      } else if (irrigation === "flood") {
        match.textContent = "Potential topic to explore: micro-irrigation transition support. This is not an official scheme or eligibility decision.";
      } else {
        match.textContent = "Potential topic to explore: water-efficient farming support. This is not an official scheme or eligibility decision.";
      }
    };
    subsidyForm.addEventListener("input", updateSchemePrompt);
    subsidyForm.addEventListener("change", updateSchemePrompt);
  }
  const decisionInputs = ["rainfall", "nitrogen", "irrigation"].map((name) => document.querySelector(`#${name}-input`));
  if (decisionInputs.every(Boolean)) {
    const updateForecast = () => {
      const rainfall = Number(document.querySelector("#rainfall-input").value);
      const nitrogen = Number(document.querySelector("#nitrogen-input").value);
      const irrigation = Number(document.querySelector("#irrigation-input").value);
      const forecast = 1.8 + rainfall * 0.025 + nitrogen * 0.018 + irrigation * 0.012;
      const roundedForecast = Math.round((forecast + 1e-9) * 10) / 10;
      const delta = roundedForecast - 4.8;
      document.querySelector("#rainfall-value").textContent = `${rainfall} mm`;
      document.querySelector("#nitrogen-value").textContent = `${nitrogen} kg/ha`;
      document.querySelector("#irrigation-value").textContent = `${irrigation} mm`;
      document.querySelector("#yield-forecast").textContent = roundedForecast.toFixed(1);
      document.querySelector("#yield-delta").textContent = `${delta >= 0 ? "+" : ""}${delta.toFixed(1)} t/ha`;
      document.querySelector("#decision-recommendation").textContent = rainfall < 40
        ? "Low sample rainfall: compare irrigation scenarios, then validate water needs locally."
        : nitrogen < 35
          ? "Lower sample nitrogen input: confirm nutrient needs with a soil test before acting."
          : "Scenario updated. Validate inputs and recommendations with local agronomists.";
    };
    decisionInputs.forEach((input) => input.addEventListener("input", updateForecast));
  }
  pageContent.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.action === "dispatch") {
        lotDispatched = !lotDispatched;
        showToast(lotDispatched ? "Sample lot AGR-NSK-2041 marked as dispatched." : "Sample lot marked ready to dispatch.");
      } else {
        irrigationScheduled = !irrigationScheduled;
        showToast(irrigationScheduled ? `Sample irrigation scheduled for ${selectedDistrict}.` : "Sample irrigation schedule cleared.");
      }
      render("logistics");
    });
  });
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => render(button.dataset.page));
});
document.querySelector("#district-select").addEventListener("change", (event) => {
  selectedDistrict = event.target.value;
  render(activePage);
});
document.querySelector(".notification-button").addEventListener("click", () => showToast("You’re all caught up on demo notifications."));
render();
