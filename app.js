(function () {
  const root = document.getElementById("pageContent");
  const page = document.body.dataset.page;
  const reportState = {
    filteredReports: [...projectData.reports],
    selectedId: projectData.reports[0] ? projectData.reports[0].id : null
  };

  function getReportNavLabel(report) {
    return `Day ${report.id}`;
  }

  function createStatCard(title, value, note) {
    return `
      <div class="card">
        <strong>${title}</strong>
        <span>${value}</span>
        ${note ? `<p>${note}</p>` : ""}
      </div>
    `;
  }

  function createPhotoCard(photo) {
    return `
      <div class="photo-card">
        <div class="photo-frame">
          <img src="${photo.src}" alt="${photo.caption}" onerror="this.parentElement.innerHTML='Photo unavailable<br>${photo.caption.replace(/'/g, "&apos;")}';" />
        </div>
        <p>${photo.caption}</p>
      </div>
    `;
  }

  function createBarChart(title, subtitle, series, suffix = "", decimals = 0) {
    const max = Math.max(...series.map((item) => item.value), 1);

    return `
      <article class="chart-card section-card">
        <p class="eyebrow">Survey Evaluation</p>
        <h3>${title}</h3>
        <p class="section-copy">${subtitle}</p>
        ${series
          .map((item) => {
            const valueText =
              decimals > 0 ? `${item.value.toFixed(decimals)}${suffix}` : `${item.value}${suffix}`;
            return `
              <div class="chart-bar">
                <div class="series-row">
                  <span>${item.label}</span>
                  <span class="series-value">${valueText}${item.total ? ` of ${item.total}` : ""}</span>
                </div>
                <div class="bar-frame">
                  <div class="bar-fill" style="width:${(item.value / max) * 100}%"></div>
                </div>
              </div>
            `;
          })
          .join("")}
      </article>
    `;
  }

  function setBranding() {
    const eyebrow = document.querySelector(".brand .eyebrow");
    const title = document.querySelector(".brand h1");
    const mark = document.querySelector(".brand-mark");

    if (eyebrow) eyebrow.textContent = projectData.department;
    if (title) title.textContent = projectData.shortTitle;
    if (mark) mark.textContent = "CSP";

    const pageTitles = {
      overview: "Overview",
      reports: "Day to Day Reports",
      analytics: "Survey Analysis",
      comparison: "School Comparison",
      gallery: "Gallery",
      "final-report": "Summary"
    };

    document.title = `${projectData.shortTitle} | ${pageTitles[page] || "Portal"}`;
  }

  function renderOverviewPage() {
    root.innerHTML = `
      <section class="hero-panel">
        <div class="hero-copy">
          <p class="eyebrow">${projectData.reportLabel}</p>
          <h2>${projectData.title}</h2>
          <p>${projectData.subtitle}</p>
          <div class="hero-note">${projectData.institution} | Academic Year ${projectData.academicYear}</div>
        </div>
        <div class="hero-side">
          <div class="cards-grid">
            ${createStatCard("Schools Visited", projectData.stats.schoolsVisited, "Schools covered under the CSP survey")}
            ${createStatCard("Awareness Sessions", projectData.stats.awarenessSessions, "Awareness sessions conducted in schools")}
            ${createStatCard("Visual Materials", projectData.stats.visualMaterials, "Poster, pamphlets, and flyers")}
          </div>
        </div>
      </section>

      <section class="summary-band">
        <div>
          <p class="eyebrow">Why This Project</p>
          <h3>Why the survey was taken up</h3>
          <p>${projectData.whyThisProject[0]}</p>
          <p>${projectData.whyThisProject[1]}</p>
        </div>
        <div>
          <p class="eyebrow">Problem Statement</p>
          <h3>What the project is addressing</h3>
          <p>${projectData.problemStatement[0]}</p>
          <p>${projectData.problemStatement[1]}</p>
        </div>
        <div>
          <p class="eyebrow">Project Focus</p>
          <h3>Books, eye care, and better digital habits</h3>
          <p>${projectData.posterHighlights[0]}</p>
          <p>${projectData.posterHighlights[1]}</p>
        </div>
      </section>

      <section class="analysis-grid">
        <article class="section-card">
          <p class="eyebrow">Project Objectives</p>
          <h3>Goals of the current survey work</h3>
          <ul class="detail-list">
            ${projectData.objectives.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
        <article class="section-card">
          <p class="eyebrow">Methodology</p>
          <h3>How the survey visits were carried out</h3>
          <ol class="timeline-list">
            ${projectData.methodology.map((item) => `<li>${item}</li>`).join("")}
          </ol>
        </article>
      </section>

      <section class="analysis-grid">
        <article class="section-card">
          <p class="eyebrow">Poster Highlights</p>
          <h3>Awareness themes used during the survey visits</h3>
          <ul class="detail-list">
            ${projectData.posterHighlights.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
        <article class="section-card">
          <p class="eyebrow">Visit Details</p>
          <h3>Document-based field information</h3>
          <div class="team-grid">
            ${projectData.team
              .map((member) => `<div class="team-card"><h4>${member.name}</h4><p>${member.role}</p></div>`)
              .join("")}
          </div>
        </article>
      </section>

      <section class="analysis-grid">
        <article class="section-card">
          <p class="eyebrow">Visit Timeline</p>
          <h3>Progress of school survey visits</h3>
          <ol class="timeline-list">
            ${projectData.timeline.map((item) => `<li>${item}</li>`).join("")}
          </ol>
        </article>
        <article class="section-card">
          <p class="eyebrow">Awareness Poster</p>
          <h3>Material used across the sessions</h3>
          ${createPhotoCard(projectData.featuredPoster)}
        </article>
      </section>
    `;
  }

  function buildReportList() {
    const list = document.getElementById("reportList");
    list.innerHTML = reportState.filteredReports
      .map(
        (report) => `
          <button class="report-item ${report.id === reportState.selectedId ? "active" : ""}" data-report-id="${report.id}" type="button">
            <strong>${getReportNavLabel(report)}</strong>
            <span>${report.schoolName}</span>
            <span>${report.date}</span>
          </button>
        `
      )
      .join("");

    list.querySelectorAll(".report-item").forEach((button) => {
      button.addEventListener("click", () => {
        reportState.selectedId = Number(button.dataset.reportId);
        buildReportList();
        buildReportDetail();
      });
    });
  }

  function buildReportDetail() {
    const detail = document.getElementById("reportDetail");
    const report = projectData.reports.find((entry) => entry.id === reportState.selectedId);

    if (!report) {
      detail.innerHTML = "<p>No report selected.</p>";
      return;
    }

    detail.innerHTML = `
      <div class="report-title-row">
        <div>
          <p class="eyebrow">Visit Report</p>
          <h3>${report.label}</h3>
          <p class="section-copy">${report.conclusion}</p>
        </div>
        <span class="status-chip">${report.status}</span>
      </div>

      <div class="report-meta-grid">
        <div class="detail-card"><strong>School</strong><span>${report.schoolName}</span></div>
        <div class="detail-card"><strong>Location</strong><span>${report.location}</span></div>
        <div class="detail-card"><strong>Date</strong><span>${report.date}</span></div>
        <div class="detail-card"><strong>Mentor</strong><span>${report.mentor}</span></div>
      </div>

      <section class="report-block">
        <h4>Operational Activities</h4>
        <ul class="detail-list">${report.activities.map((item) => `<li>${item}</li>`).join("")}</ul>
      </section>

      <section class="report-block">
        <h4>Analysis Snapshot</h4>
        <div class="report-highlights">
          ${report.analysisSnapshot
            .map((item) => `<div class="highlight-card"><strong>${item.label}</strong><p>${item.value}</p></div>`)
            .join("")}
        </div>
      </section>

      <section class="report-block">
        <h4>Survey Questions</h4>
        <ol class="timeline-list">${report.surveyQuestions.map((item) => `<li>${item}</li>`).join("")}</ol>
      </section>

      <section class="report-block">
        <h4>Awareness Topics and Preventive Measures</h4>
        <div class="analysis-grid">
          <div class="detail-card">
            <strong>Awareness Topics</strong>
            <ul class="detail-list">${report.awarenessTopics.map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
          <div class="detail-card">
            <strong>Preventive Measures</strong>
            <ul class="detail-list">${report.precautions.map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
        </div>
      </section>

      <section class="report-block">
        <h4>Observations and Visit Outcomes</h4>
        <div class="analysis-grid">
          <div class="detail-card">
            <strong>Observations</strong>
            <ul class="detail-list">${report.observations.map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
          <div class="detail-card">
            <strong>Visit Outcomes</strong>
            <ul class="detail-list">${report.visitOutcomes.map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
        </div>
      </section>

      <section class="report-block">
        <h4>Materials and Next Visit Plan</h4>
        <div class="analysis-grid">
          <div class="detail-card">
            <strong>Materials Used</strong>
            <ul class="detail-list">${report.materialsUsed.map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
          <div class="detail-card">
            <strong>Materials for Next Visit</strong>
            <ul class="detail-list">${report.nextVisitMaterials.map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
        </div>
        <div class="analysis-grid">
          <div class="detail-card">
            <strong>Ideas After Visit</strong>
            <ul class="detail-list">${report.ideasAfterVisit.map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
          <div class="detail-card">
            <strong>Next Steps</strong>
            <ul class="detail-list">${report.nextSteps.map((item) => `<li>${item}</li>`).join("")}</ul>
          </div>
        </div>
      </section>

      <section class="report-block">
        <h4>Photo Documentation</h4>
        <div class="gallery-grid report-photo-grid">
          ${report.photoPaths.map((photo) => createPhotoCard(photo)).join("")}
        </div>
      </section>
    `;
  }

  function renderReportsPage() {
    root.innerHTML = `
      <section class="hero-panel">
        <div class="hero-copy">
          <p class="eyebrow">Day to Day Reports</p>
          <h2>School visit records and community survey activities.</h2>
          <p>This section presents the CSP school visit details, including awareness activities, survey topics, observations, materials used, and follow-up plans.</p>
        </div>
        <div class="hero-side">
          <div class="cards-grid">
            ${createStatCard("Visits Added", projectData.reports.length, "School visits included in the portal")}
            ${createStatCard(
              "Materials Used",
              new Set(projectData.reports.flatMap((report) => report.materialsUsed)).size,
              "Distinct awareness support used during visits"
            )}
            ${createStatCard("Photos Added", projectData.gallery.reduce((sum, group) => sum + group.photos.length, 0), "School visit and poster documentation")}
          </div>
        </div>
      </section>

      <section class="report-layout">
        <aside class="report-list">
          <p class="eyebrow">Day to Day Reports</p>
          <h3>Select a visit</h3>
          <input id="reportSearch" class="report-search" type="search" placeholder="Search by report, school, or location" />
          <div id="reportList"></div>
        </aside>
        <article id="reportDetail" class="report-detail"></article>
      </section>
    `;

    buildReportList();
    buildReportDetail();

    document.getElementById("reportSearch").addEventListener("input", (event) => {
      const term = event.target.value.trim().toLowerCase();
      reportState.filteredReports = projectData.reports.filter((report) =>
        [report.day, getReportNavLabel(report), report.schoolName, report.location, report.label].some((value) =>
          String(value).toLowerCase().includes(term)
        )
      );

      if (!reportState.filteredReports.some((report) => report.id === reportState.selectedId)) {
        reportState.selectedId = reportState.filteredReports[0] ? reportState.filteredReports[0].id : null;
      }

      buildReportList();
      buildReportDetail();
    });
  }

  function renderAnalyticsPage() {
    root.innerHTML = `
      <section class="hero-panel">
        <div class="hero-copy">
          <p class="eyebrow">Survey Analysis</p>
          <h2>Survey findings and awareness insights.</h2>
          <p>${projectData.analytics.headline}</p>
        </div>
        <div class="hero-side">
          <div class="metrics-grid">
            ${projectData.analytics.metrics
              .map((item) => createStatCard(item.title, item.value, item.note))
              .join("")}
          </div>
        </div>
      </section>

      <section class="section-card">
        <p class="eyebrow">Key Findings</p>
        <h3>Main findings from the school survey visits</h3>
        <div class="insight-grid">
          ${projectData.analytics.findings
            .map((item) => `<div class="insight-card"><p>${item}</p></div>`)
            .join("")}
        </div>
      </section>

      <section class="chart-grid">
        ${createBarChart(
          "Cumulative Schools Covered",
          "Growth of school coverage during the survey visits.",
          projectData.analytics.series.cumulativeSchools
        )}
        ${createBarChart(
          "Improvement Ideas Collected",
          "Follow-up ideas identified after each school visit.",
          projectData.analytics.series.ideasCount
        )}
      </section>

      <section class="analysis-grid">
        <article class="section-card">
          <p class="eyebrow">Poster Messages</p>
          <h3>Main awareness themes</h3>
          <ul class="detail-list">
            ${projectData.analytics.posterThemes.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
        <article class="section-card">
          <p class="eyebrow">Source Evidence</p>
          <h3>School visit references</h3>
          <ul class="detail-list">
            ${projectData.analytics.evidence.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </article>
      </section>
    `;
  }

  function renderComparisonPage() {
    root.innerHTML = `
      <section class="hero-panel">
        <div class="hero-copy">
          <p class="eyebrow">School Comparison Matrix</p>
          <h2>Visit-wise comparison of repeated issues and awareness focus.</h2>
          <p>This page compares the school visits based on recurring concerns, awareness themes, and the overall focus of each survey interaction.</p>
        </div>
        <div class="hero-side">
          <div class="cards-grid">
            ${createStatCard("Schools Compared", projectData.comparison.length, "Schools included in the comparison")}
            ${createStatCard("Common Theme", "Eye Care", "Repeated across all schools")}
            ${createStatCard("Poster Support", "Yes", "Used in classroom sessions")}
            ${createStatCard("Approach", "Preventive", "Focused on awareness and habit change")}
          </div>
        </div>
      </section>

      <section class="table-card">
        <p class="eyebrow">Visit Matrix</p>
        <h3>Visit-wise evaluation summary</h3>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Report</th>
                <th>Date</th>
                <th>School</th>
                <th>Key Issue</th>
                <th>Awareness Focus</th>
                <th>Analytic Note</th>
              </tr>
            </thead>
            <tbody>
              ${projectData.comparison
                .map(
                  (row) => `
                    <tr>
                      <td>${row.day}</td>
                      <td>${row.date}</td>
                      <td>${row.school}</td>
                      <td>${row.keyIssue}</td>
                      <td>${row.focus}</td>
                      <td>${row.note}</td>
                    </tr>
                  `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  function renderGalleryPage() {
    root.innerHTML = `
      <section class="hero-panel">
        <div class="hero-copy">
          <p class="eyebrow">Visual Documentation</p>
          <h2>School visit photos and awareness material.</h2>
          <p>The gallery presents classroom visit photos and the awareness poster used to explain eye health, reading habits, and preventive measures.</p>
        </div>
        <div class="hero-side">
          <div class="cards-grid">
            ${createStatCard("Gallery Sections", projectData.gallery.length, "Visit photos and awareness material")}
            ${createStatCard(
              "Photo Items",
              projectData.gallery.reduce((sum, group) => sum + group.photos.length, 0),
              "Classroom photos and poster material"
            )}
            ${createStatCard("Source", "School Visits", "Community survey documentation")}
            ${createStatCard("Layout", "Responsive", "Desktop and mobile ready")}
          </div>
        </div>
      </section>

      ${projectData.gallery
        .map(
          (group) => `
            <section class="gallery-group">
              <p class="eyebrow">${group.category}</p>
              <h3>${group.category}</h3>
              <p>${group.description}</p>
              <div class="gallery-grid">
                ${group.photos.map((photo) => createPhotoCard(photo)).join("")}
              </div>
            </section>
          `
        )
        .join("")}
    `;
  }

  function renderFinalReportPage() {
    const final = projectData.finalReport;

    root.innerHTML = `
      <section class="hero-panel">
        <div class="hero-copy">
          <p class="eyebrow">Project Summary</p>
          <h2>Overall outcome of the community survey work.</h2>
          <p>This page summarizes the key conclusions, observations, impact, and recommendations from the CSP school awareness visits.</p>
        </div>
        <div class="hero-side">
          <div class="summary-grid">
            ${final.summary.map((item) => createStatCard(item.title, item.value, item.note)).join("")}
          </div>
        </div>
      </section>

      <section class="final-grid">
        <article class="section-card">
          <p class="eyebrow">Findings</p>
          <h3>Key findings</h3>
          <ul class="detail-list">${final.keyFindings.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
        <article class="section-card">
          <p class="eyebrow">Observations</p>
          <h3>Major observations</h3>
          <ul class="detail-list">${final.majorObservations.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
        <article class="section-card">
          <p class="eyebrow">Impact</p>
          <h3>Impact created</h3>
          <ul class="detail-list">${final.impactCreated.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
        <article class="section-card">
          <p class="eyebrow">Recommendations</p>
          <h3>Recommended actions</h3>
          <ul class="detail-list">${final.recommendations.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      </section>

      <section class="conclusion-card">
        <p class="eyebrow">Conclusion</p>
        <h3>Combined report conclusion</h3>
        <p>${final.conclusion}</p>
      </section>
    `;
  }

  function setActiveNav() {
    document.querySelectorAll(".page-nav a").forEach((link) => {
      const href = link.getAttribute("href");
      if (
        (page === "overview" && href === "index.html") ||
        (page === "reports" && href === "reports.html") ||
        (page === "analytics" && href === "analytics.html") ||
        (page === "comparison" && href === "comparison.html") ||
        (page === "gallery" && href === "gallery.html") ||
        (page === "final-report" && href === "final-report.html")
      ) {
        link.classList.add("is-active");
      }
    });
  }

  function configureDarkMode() {
    const toggle = document.getElementById("darkModeToggle");
    const savedTheme = localStorage.getItem("cspTheme") || "light";
    document.documentElement.dataset.theme = savedTheme;
    toggle.textContent = savedTheme === "dark" ? "Light Mode" : "Dark Mode";

    toggle.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme;
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("cspTheme", next);
      toggle.textContent = next === "dark" ? "Light Mode" : "Dark Mode";
    });
  }

  function configurePrint() {
    document.getElementById("download-report").addEventListener("click", () => window.print());
  }

  function renderPage() {
    if (page === "overview") renderOverviewPage();
    if (page === "reports") renderReportsPage();
    if (page === "analytics") renderAnalyticsPage();
    if (page === "comparison") renderComparisonPage();
    if (page === "gallery") renderGalleryPage();
    if (page === "final-report") renderFinalReportPage();
  }

  setBranding();
  renderPage();
  setActiveNav();
  configureDarkMode();
  configurePrint();
})();
