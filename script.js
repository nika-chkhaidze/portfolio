const svgIcons = {
    'clear': `<svg class="weather-icon" viewBox="0 0 64 64"><circle cx="32" cy="32" r="16" fill="#FFD700"/><g stroke="#FFD700" stroke-width="3"><line x1="32" y1="8" x2="32" y2="0"/><line x1="32" y1="56" x2="32" y2="64"/><line x1="8" y1="32" x2="0" y2="32"/><line x1="56" y1="32" x2="64" y2="32"/><line x1="14" y1="14" x2="6" y2="6"/><line x1="50" y1="50" x2="58" y2="58"/><line x1="14" y1="50" x2="6" y2="58"/><line x1="50" y1="14" x2="58" y2="6"/></g></svg>`,
    'clouds': `<svg class="weather-icon" viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="20" ry="12" fill="#b3c6e7"/><ellipse cx="44" cy="36" rx="12" ry="8" fill="#90a4ae"/></svg>`,
    'rain': `<svg class="weather-icon" viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="20" ry="12" fill="#b3c6e7"/><ellipse cx="44" cy="36" rx="12" ry="8" fill="#90a4ae"/><line x1="24" y1="52" x2="24" y2="60" stroke="#2196f3" stroke-width="4"/><line x1="32" y1="52" x2="32" y2="60" stroke="#2196f3" stroke-width="4"/><line x1="40" y1="52" x2="40" y2="60" stroke="#2196f3" stroke-width="4"/></svg>`,
    'snow': `<svg class="weather-icon" viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="20" ry="12" fill="#b3c6e7"/><ellipse cx="44" cy="36" rx="12" ry="8" fill="#90a4ae"/><text x="32" y="58" text-anchor="middle" font-size="24" fill="#fff">❄️</text></svg>`,
    'storm': `<svg class="weather-icon" viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="20" ry="12" fill="#b3c6e7"/><polygon points="32,44 38,54 28,54" fill="#FFD700"/><polygon points="32,44 36,50 28,54" fill="#FFA500"/></svg>`,
    'mist': `<svg class="weather-icon" viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="20" ry="12" fill="#b3c6e7"/><rect x="12" y="52" width="40" height="6" fill="#b3c6e7" opacity="0.7"/></svg>`,
    'drizzle': `<svg class="weather-icon" viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="20" ry="12" fill="#b3c6e7"/><ellipse cx="44" cy="36" rx="12" ry="8" fill="#90a4ae"/><line x1="32" y1="52" x2="32" y2="58" stroke="#2196f3" stroke-width="3"/></svg>`,
    'default': `<svg class="weather-icon" viewBox="0 0 64 64"><circle cx="32" cy="32" r="16" fill="#b3c6e7"/></svg>`
};

const wiIcons = {
    'clear': 'wi-day-sunny',
    'clouds': 'wi-cloudy',
    'rain': 'wi-rain',
    'snow': 'wi-snow',
    'storm': 'wi-thunderstorm',
    'mist': 'wi-fog',
    'drizzle': 'wi-sprinkle',
    'default': 'wi-na'
};

function getSVGIcon(condition) {
    condition = condition.toLowerCase();
    for (let key in svgIcons) {
        if (condition.includes(key)) return svgIcons[key];
    }
    return svgIcons['default'];
}

function getWiIcon(condition) {
    condition = condition.toLowerCase();
    for (let key in wiIcons) {
        if (condition.includes(key)) return wiIcons[key];
    }
    return wiIcons['default'];
}

function setBackground(condition) {
    let gradient;
    condition = condition.toLowerCase();
    if (document.body.classList.contains('dark')) {
        gradient = 'linear-gradient(to bottom, #181824, #232526)';
    } else if (condition.includes('clear')) gradient = 'linear-gradient(to bottom, #87CEEB, #FDE68A)';
    else if (condition.includes('rain')) gradient = 'linear-gradient(to bottom, #60A5FA, #3B82F6)';
    else if (condition.includes('snow')) gradient = 'linear-gradient(to bottom, #E0F2FE, #BAE6FD)';
    else gradient = 'linear-gradient(to bottom, #a1c4fd, #c2e9fb)';
    document.body.style.background = gradient;
}

function showLoading(show) {
    document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
    document.getElementById('weatherResult').style.opacity = show ? 0.3 : 1;
}

async function getWeather(city) {
    showLoading(true);
    const resultDiv = document.getElementById('weatherResult');
    resultDiv.textContent = '';
    try {
        const response = await fetch(`http://localhost:5000/weather?city=${encodeURIComponent(city)}`);
        showLoading(false);
        if (!response.ok) {
            resultDiv.textContent = 'City not found or API error.';
            setBackground('default');
            return;
        }
        const data = await response.json();
        setBackground(data.condition);
        let html = `
            <div style="display:flex;align-items:center;gap:18px;justify-content:center;min-height:80px;">
                <i class="wi ${getWiIcon(data.condition)}" style="font-size:3.5em;"></i>
                <span style="font-size:2em;"><strong>${data.city}</strong></span>
            </div>
            <div style="font-size:1.5em;">${Math.round(data.temperature)}°C</div>
            <div style="font-size:1.1em;">💧 ${data.humidity}%</div>
            <div style="font-size:1.1em;">${data.condition}</div>
        `;
        resultDiv.innerHTML = html;
        // Optionally fetch forecast
        getForecast(city);
    } catch (error) {
        showLoading(false);
        resultDiv.textContent = 'Error fetching weather data.';
        setBackground('default');
    }
}

async function getForecast(city) {
    const forecastDiv = document.getElementById('forecastCards');
    forecastDiv.innerHTML = '';
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=281a1caab89fe672adf2a8d0a6c72482&units=metric`);
        if (!response.ok) return;
        const data = await response.json();
        // Group by day
        const days = {};
        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!days[date]) days[date] = [];
            days[date].push(item);
        });
        const dayKeys = Object.keys(days).slice(0, 5);
        dayKeys.forEach(date => {
            const items = days[date];
            // Use midday forecast
            const midday = items[Math.floor(items.length/2)];
            const icon = getWiIcon(midday.weather[0].description);
            forecastDiv.innerHTML += `
                <div class="forecast-card">
                    <div>${date.slice(5)}</div>
                    <i class="wi ${icon}" style="font-size:2em;"></i>
                    <div>${Math.round(midday.main.temp)}°C</div>
                </div>
            `;
        });
    } catch (error) {
        // Ignore forecast errors
    }
}

window.onload = function() {
    const cityInput = document.getElementById('cityInput');
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    // Hamburger menu logic
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const menuContent = document.getElementById('menuContent');
    if (hamburgerBtn && menuContent) {
        hamburgerBtn.onclick = function() {
            menuContent.classList.toggle('open');
        };
    }
    if (cityInput) {
        cityInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                getWeather(cityInput.value);
                menuContent.classList.remove('open');
            }
        });
    }
    if (getWeatherBtn) {
        getWeatherBtn.onclick = function() {
            getWeather(cityInput.value);
            menuContent.classList.remove('open');
        };
    }
    // Dark mode toggle
    const darkSwitch = document.getElementById('darkModeSwitch');
    if (darkSwitch) {
        darkSwitch.addEventListener('change', function() {
            document.body.classList.toggle('dark', darkSwitch.checked);
        });
    }
    // Geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=281a1caab89fe672adf2a8d0a6c72482&units=metric`)
                .then(r => r.json())
                .then(data => {
                    if (data.name) {
                        cityInput.value = data.name;
                        getWeather(data.name);
                    }
                });
        });
    }
};
