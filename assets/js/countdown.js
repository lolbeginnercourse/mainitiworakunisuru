(() => {
  const timer = document.querySelector("[data-release-at]");
  if (!timer) return;
  const releaseAt = new Date(timer.dataset.releaseAt).getTime();
  const nodes = {
    days: timer.querySelector("[data-countdown-days]"),
    hours: timer.querySelector("[data-countdown-hours]"),
    minutes: timer.querySelector("[data-countdown-minutes]"),
    seconds: timer.querySelector("[data-countdown-seconds]")
  };
  const update = () => {
    const remaining = Math.max(0, releaseAt - Date.now());
    nodes.days.textContent = Math.floor(remaining / 86400000);
    nodes.hours.textContent = String(Math.floor((remaining % 86400000) / 3600000)).padStart(2, "0");
    nodes.minutes.textContent = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");
    nodes.seconds.textContent = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");
  };
  update();
  window.setInterval(update, 1000);
})();
