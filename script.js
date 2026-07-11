const endAt = Date.now() + 1000 * 60 * 45;

function pad(value) {
  return String(value).padStart(2, "0");
}

function tick() {
  const remaining = Math.max(0, endAt - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Timer original
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  
  if (hoursEl) hoursEl.textContent = pad(hours);
  if (minutesEl) minutesEl.textContent = pad(minutes);
  if (secondsEl) secondsEl.textContent = pad(seconds);
  
  // Timer do hero
  const hoursHeroEl = document.getElementById("hours-hero");
  const minutesHeroEl = document.getElementById("minutes-hero");
  const secondsHeroEl = document.getElementById("seconds-hero");
  
  if (hoursHeroEl) hoursHeroEl.textContent = pad(hours);
  if (minutesHeroEl) minutesHeroEl.textContent = pad(minutes);
  if (secondsHeroEl) secondsHeroEl.textContent = pad(seconds);
}

tick();
setInterval(tick, 1000);
