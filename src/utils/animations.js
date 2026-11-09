export function initAnimations() {
  const revealTargets = document.querySelectorAll(".reveal, .reveal-group");
  let revealObserver = null;
  let counterObserver = null;

  if (!("IntersectionObserver" in window) || revealTargets.length === 0) {
    revealTargets.forEach((el) => el.classList.add("in-view"));
  } else {
    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  /* Animated stat counters */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length > 0) {
    function animateCounter(el) {
      const target = parseInt(el.getAttribute("data-count"), 10) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = value.toLocaleString("en-IN") + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
    } else {
      counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => counterObserver.observe(el));
    }
  }

  return () => {
    if (revealObserver) revealObserver.disconnect();
    if (counterObserver) counterObserver.disconnect();
  };
}

