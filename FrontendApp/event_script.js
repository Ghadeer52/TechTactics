const sportSelect = document.getElementById("sport");
const leagueSelect = document.getElementById("league");
const seasonSelect = document.getElementById("season");
const monthSelect = document.getElementById("month");
const daySelect = document.getElementById("day");

// 1. Load sports and initialize
async function loadSports() {
  const sports = ["Soccer", "Basketball", "Baseball"];
  sportSelect.innerHTML = sports.map(s => `<option value="${s}">${s}</option>`).join("");
  await loadLeagues();
}

// 2. Load leagues
async function loadLeagues() {
  const res = await fetch("https://www.thesportsdb.com/api/v1/json/3/all_leagues.php");
  const data = await res.json();
  const leagues = data.leagues.filter(l => l.strSport === sportSelect.value);

  leagueSelect.innerHTML = `<option value="">Select League</option>` +
    leagues.map(l => `<option value="${l.idLeague}">${l.strLeague}</option>`).join("");
}

// 3. Load seasons
leagueSelect.addEventListener("change", async () => {
  const id = leagueSelect.value;
  const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?id=${id}`);
  const data = await res.json();
  seasonSelect.innerHTML = `<option value="">Select Season</option>` +
    (data.seasons || []).map(s => `<option value="${s.strSeason}">${s.strSeason}</option>`).join("");
});

// 4. Date filtering functions
function loadMonths() {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  monthSelect.innerHTML = `<option value="">Month</option>` +
    months.map((m, i) => `<option value="${String(i+1).padStart(2, '0')}">${m}</option>`).join("");
}

function loadDays() {
  daySelect.innerHTML = `<option value="">Day</option>` +
    Array.from({length: 31}, (_, i) => 
      `<option value="${String(i+1).padStart(2, '0')}">${i+1}</option>`
    ).join("");
}

// 5. Search and filter (FIXED)
async function searchEvents() {
  const leagueId = leagueSelect.value;
  const season = seasonSelect.value;
  const month = monthSelect.value;
  const day = daySelect.value;
  const container = document.getElementById("event-results");

  if (!leagueId || !season) {
    container.innerHTML = `<div class="error">Please select both league and season</div>`;
    return;
  }

  container.innerHTML = `<div class="loader"></div>`;

  try {
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=${leagueId}&s=${season}`);
    const data = await res.json();
    let events = data.events || [];

    // Proper date filtering
    events = events.filter(event => {
      if (!event.dateEvent) return false;
      
      const [year, eventMonth, eventDay] = event.dateEvent.split('-');
      let match = true;
      
      if (month && month !== eventMonth) match = false;
      if (day && day !== eventDay) match = false;
      
      return match;
    });

    if (events.length === 0) {
      container.innerHTML = `<div class="error"> No events found for this selection</div>`;
      return;
    }

    container.innerHTML = events.map(e => `
      <div class="feature-card">
        <h3>${e.strEvent}</h3>
        <div class="team-matchup">
          <div class="team">
            <img src="${e.strHomeTeamBadge || 'https://via.placeholder.com/50'}" 
                 alt="${e.strHomeTeam}" 
                 class="team-logo"
                 onerror="this.src='https://via.placeholder.com/50'">
            <p>${e.strHomeTeam}</p>
          </div>
          <div class="vs">VS</div>
          <div class="team">
            <img src="${e.strAwayTeamBadge || 'https://via.placeholder.com/50'}" 
                 alt="${e.strAwayTeam}" 
                 class="team-logo"
                 onerror="this.src='https://via.placeholder.com/50'">
            <p>${e.strAwayTeam}</p>
          </div>
        </div>
        <div class="match-details">
          <p><span>📅</span> ${e.dateEvent} | <span>🕒</span> ${e.strTime || "TBD"}</p>
        </div>
      </div>
    `).join("");

  } catch (error) {
    container.innerHTML = `<div class="error"> Error: ${error.message}</div>`;
  }
}

// 6. Initialize all components
function init() {
  loadSports();
  loadMonths();
  loadDays();
  
  // Event listeners
  sportSelect.addEventListener("change", loadLeagues);
  document.querySelector("button").addEventListener("click", searchEvents);
}

// Start the app
init();