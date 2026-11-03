/* Renders a single camp's details on camp-details.html based on the ?id= query param. */

(function () {
  "use strict";

  const mount = document.getElementById("detailsMount");
  if (!mount) return;

  const ICON_CALENDAR =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path stroke-linecap="round" d="M16 2v4M8 2v4M3 10h18"/></svg>';
  const ICON_CLOCK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3"/></svg>';
  const ICON_PIN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  const ICON_PHONE =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c1 .4 2 .6 3 .7a2 2 0 0 1 1.7 2z"/></svg>';
  const ICON_DROP =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2s7 8.2 7 12.5A7 7 0 1 1 5 14.5C5 10.2 12 2 12 2z"/></svg>';

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const camp = CAMPS.find((c) => c.id === id) || CAMPS[0];

  document.title = `${camp.title} · LifeDrop Blood Bank`;

  mount.innerHTML = `
    <div class="pill-badge" style="margin:0 auto 18px;">${ICON_CALENDAR}</div>
    <h2>${camp.title}</h2>
    <p class="org">${camp.org}</p>
    <div class="details-list">
      <div class="row"><span class="icn">${ICON_CALENDAR}</span><div><b>Date</b><span>${camp.dateLabel}</span></div></div>
      <div class="row"><span class="icn">${ICON_DROP}</span><div><b>Required blood group(s)</b><span>${camp.bloodGroups.join(", ")}</span></div></div>
      <div class="row"><span class="icn">${ICON_CLOCK}</span><div><b>Time</b><span>${camp.time}</span></div></div>
      <div class="row"><span class="icn">${ICON_PIN}</span><div><b>Location</b><span>${camp.address}</span></div></div>
      <div class="row"><span class="icn">${ICON_PHONE}</span><div><b>Contact for more details</b><span>${camp.contactName}: ${camp.contactPhone}</span></div></div>
    </div>
    <p class="details-note">${camp.note}</p>
    <a class="btn btn-primary btn-block" href="register.html" style="margin-top:22px;">
      Register now
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 5l7 7-7 7"/></svg>
    </a>
  `;
})();
