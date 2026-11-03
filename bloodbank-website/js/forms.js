/* Form validation + simulated submission handling.
   No backend exists, so successful submissions are stored in localStorage
   and the person gets clear, immediate feedback (banner + toast). */

(function () {
  "use strict";

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[+]?[0-9\s-]{7,15}$/;

  function setError(input, message) {
    const shell = input.closest(".input-shell") || input;
    shell.classList.toggle("invalid", Boolean(message));
    const field = input.closest(".field");
    if (field) {
      const errorEl = field.querySelector(".error-text");
      if (errorEl) errorEl.textContent = message || "";
    }
  }

  function required(input, label) {
    const val = input.type === "checkbox" ? input.checked : input.value.trim();
    if (!val) {
      setError(input, `${label} is required.`);
      return false;
    }
    setError(input, "");
    return true;
  }

  function validEmail(input) {
    if (!EMAIL_RE.test(input.value.trim())) {
      setError(input, "Enter a valid email address.");
      return false;
    }
    setError(input, "");
    return true;
  }

  function validPhone(input) {
    if (!PHONE_RE.test(input.value.trim())) {
      setError(input, "Enter a valid phone number.");
      return false;
    }
    setError(input, "");
    return true;
  }

  function minLength(input, label, len) {
    if (input.value.length < len) {
      setError(input, `${label} must be at least ${len} characters.`);
      return false;
    }
    setError(input, "");
    return true;
  }

  function showBanner(form, type, message) {
    let banner = form.querySelector(".banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.className = "banner";
      banner.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg><span></span>';
      form.prepend(banner);
    }
    const successIcon = '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>';
    const errorIcon = '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.3 3.86l-8.2 14.2A2 2 0 0 0 3.8 21h16.4a2 2 0 0 0 1.7-2.94l-8.2-14.2a2 2 0 0 0-3.4 0z"/>';
    banner.querySelector("svg").innerHTML = type === "success" ? successIcon : errorIcon;
    banner.querySelector("span").textContent = message;
    banner.className = `banner show ${type}`;
  }

  /* ---------- Password visibility toggles ---------- */
  document.querySelectorAll(".toggle-visibility").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input");
      if (!input) return;
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
      btn.innerHTML = showing
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.6 21.6 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a21.6 21.6 0 0 1-2.44 3.35M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    });
  });

  /* ---------- Login form ---------- */
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    const email = loginForm.querySelector("#loginEmail");
    const password = loginForm.querySelector("#loginPassword");

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = [required(email, "Email") && validEmail(email), required(password, "Password")].every(Boolean);
      if (!ok) {
        showBanner(loginForm, "error", "Please fix the highlighted fields.");
        return;
      }
      showBanner(loginForm, "success", "Signed in successfully. Redirecting to your dashboard…");
      window.LifeDrop.showToast("Welcome back to LifeDrop!");
      loginForm.querySelector("button[type=submit]").disabled = true;
      setTimeout(() => {
        window.location.href = "camps.html";
      }, 1100);
    });

    [email, password].forEach((input) => {
      input.addEventListener("input", () => setError(input, ""));
    });
  }

  /* ---------- Register form ---------- */
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    const fields = {
      fullName: registerForm.querySelector("#regName"),
      dob: registerForm.querySelector("#regDob"),
      email: registerForm.querySelector("#regEmail"),
      phone: registerForm.querySelector("#regPhone"),
      password: registerForm.querySelector("#regPassword"),
      bloodGroup: registerForm.querySelector("#regBloodGroup"),
      city: registerForm.querySelector("#regCity"),
      terms: registerForm.querySelector("#regTerms"),
    };

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const checks = [
        required(fields.fullName, "Full name"),
        required(fields.dob, "Date of birth"),
        required(fields.email, "Email") && validEmail(fields.email),
        required(fields.phone, "Contact number") && validPhone(fields.phone),
        required(fields.password, "Password") && minLength(fields.password, "Password", 6),
        required(fields.bloodGroup, "Blood group"),
        required(fields.city, "City"),
        required(fields.terms, "Accepting the terms"),
      ];

      if (!checks.every(Boolean)) {
        showBanner(registerForm, "error", "Please fix the highlighted fields before continuing.");
        return;
      }

      try {
        const donors = JSON.parse(localStorage.getItem("lifedrop_donors") || "[]");
        donors.push({
          name: fields.fullName.value.trim(),
          email: fields.email.value.trim(),
          bloodGroup: fields.bloodGroup.value,
          city: fields.city.value,
          registeredAt: new Date().toISOString(),
        });
        localStorage.setItem("lifedrop_donors", JSON.stringify(donors));
      } catch (err) {
        /* localStorage may be unavailable (private mode) — submission still succeeds visually */
      }

      showBanner(registerForm, "success", "You're registered! Redirecting you to sign in…");
      window.LifeDrop.showToast("Thanks for registering as a donor!");
      registerForm.querySelector("button[type=submit]").disabled = true;
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1300);
    });

    Object.values(fields).forEach((input) => {
      input.addEventListener("input", () => setError(input, ""));
      input.addEventListener("change", () => setError(input, ""));
    });
  }

  /* ---------- Contact form ---------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const name = contactForm.querySelector("#contactName");
    const email = contactForm.querySelector("#contactEmail");
    const message = contactForm.querySelector("#contactMessage");

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = [
        required(name, "Name"),
        required(email, "Email") && validEmail(email),
        required(message, "Message"),
      ].every(Boolean);

      if (!ok) {
        showBanner(contactForm, "error", "Please fix the highlighted fields.");
        return;
      }
      showBanner(contactForm, "success", "Message sent — our team will reply within one business day.");
      window.LifeDrop.showToast("Your message has been sent!");
      contactForm.reset();
    });

    [name, email, message].forEach((input) => {
      input.addEventListener("input", () => setError(input, ""));
    });
  }

  /* ---------- Book-an-appointment modal form ---------- */
  const bookForm = document.getElementById("bookForm");
  if (bookForm) {
    const name = bookForm.querySelector("#bookName");
    const phone = bookForm.querySelector("#bookPhone");
    const date = bookForm.querySelector("#bookDate");
    const bloodGroup = bookForm.querySelector("#bookBloodGroup");

    bookForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = [
        required(name, "Name"),
        required(phone, "Phone number") && validPhone(phone),
        required(date, "Preferred date"),
        required(bloodGroup, "Blood group"),
      ].every(Boolean);

      if (!ok) {
        showBanner(bookForm, "error", "Please fix the highlighted fields.");
        return;
      }

      showBanner(bookForm, "success", "Appointment requested! We'll confirm by phone shortly.");
      window.LifeDrop.showToast("Appointment request received!");
      setTimeout(() => {
        const overlay = bookForm.closest(".modal-overlay");
        if (overlay) window.LifeDrop.closeModal(overlay);
        bookForm.reset();
        const banner = bookForm.querySelector(".banner");
        if (banner) banner.classList.remove("show");
        bookForm.querySelectorAll(".input-shell.invalid").forEach((el) => el.classList.remove("invalid"));
      }, 1500);
    });

    [name, phone, date, bloodGroup].forEach((input) => {
      input.addEventListener("input", () => setError(input, ""));
      input.addEventListener("change", () => setError(input, ""));
    });
  }
})();
