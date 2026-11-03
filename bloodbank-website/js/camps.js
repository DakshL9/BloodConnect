/* Renders camp cards on camps.html and drives the search / city / blood-group filters. */

(function () {
  "use strict";

  const grid = document.getElementById("campGrid");
  if (!grid) return; // Not on the camps page.

  const searchInput = document.getElementById("campSearch");
  const cityFilter = document.getElementById("cityFilter");
  const groupFilter = document.getElementById("groupFilter");
  const resultsLine = document.getElementById("resultsLine");
  const clearBtn = document.getElementById("clearFilters");

  const ICON_CALENDAR =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path stroke-linecap="round" d="M16 2v4M8 2v4M3 10h18"/></svg>';
  const ICON_CLOCK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3"/></svg>';
  const ICON_PIN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  const ICON_DROP =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2s7 8.2 7 12.5A7 7 0 1 1 5 14.5C5 10.2 12 2 12 2z"/></svg>';

  // Populate the city dropdown from the data set.
  const cities = Array.from(new Set(CAMPS.map((c) => c.city))).sort();
  cities.forEach((city) => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    cityFilter.appendChild(opt);
  });

  function render(list) {
    grid.innerHTML = "";

    if (list.length === 0) {
      grid.innerHTML =
        '<div class="empty-state" style="grid-column:1/-1;">No camps match your search yet. Try a different city or blood group.</div>';
      resultsLine.textContent = "Showing 0 camps";
      return;
    }

    resultsLine.textContent = `Showing results for ${list.length} camp${list.length === 1 ? "" : "s"}`;

    list.forEach((camp) => {
      const card = document.createElement("article");
      card.className = "camp-card reveal-child";
      card.innerHTML = `
        <div class="camp-card-top">
          <div class="date-badge"><span class="d">${camp.day}</span><span class="m">${camp.month}</span></div>
          <span class="status-pill">${camp.status}</span>
        </div>
        <div>
          <h3>${camp.title}</h3>
          <p class="org">${camp.org}</p>
        </div>
        <div class="camp-detail-row">${ICON_CALENDAR}<span>${camp.dateLabel}</span></div>
        <div class="camp-detail-row">${ICON_CLOCK}<span>${camp.time}</span></div>
        <div class="camp-detail-row">${ICON_PIN}<span>${camp.address}</span></div>
        <div class="camp-detail-row">${ICON_DROP}<span>Needed: ${camp.bloodGroups.join(", ")} · ${camp.registered} registered</span></div>
        <div class="camp-card-actions">
          <a class="btn btn-outline btn-sm" href="camp-details.html?id=${encodeURIComponent(camp.id)}">View details</a>
          <a class="btn btn-primary btn-sm" href="register.html">Register now</a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function applyFilters() {
    const term = searchInput.value.trim().toLowerCase();
    const city = cityFilter.value;
    const group = groupFilter.value;

    const filtered = CAMPS.filter((camp) => {
      const matchesTerm =
        !term ||
        camp.title.toLowerCase().includes(term) ||
        camp.org.toLowerCase().includes(term) ||
        camp.address.toLowerCase().includes(term) ||
        camp.city.toLowerCase().includes(term);
      const matchesCity = city === "all" || camp.city === city;
      const matchesGroup = group === "all" || camp.bloodGroups.includes(group);
      return matchesTerm && matchesCity && matchesGroup;
    });

    render(filtered);
  }

  searchInput.addEventListener("input", applyFilters);
  cityFilter.addEventListener("change", applyFilters);
  groupFilter.addEventListener("change", applyFilters);
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    cityFilter.value = "all";
    groupFilter.value = "all";
    applyFilters();
  });

  // Support ?city= or ?q= deep links from the homepage.
  const params = new URLSearchParams(window.location.search);
  if (params.get("city") && cities.includes(params.get("city"))) {
    cityFilter.value = params.get("city");
  }
  if (params.get("q")) {
    searchInput.value = params.get("q");
  }

  applyFilters();
})();
