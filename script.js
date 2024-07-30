document.addEventListener('DOMContentLoaded', function() {
    fetchWeatherData('London'); // Replace 'London' with your default city
});

document.getElementById('submit-btn').addEventListener('click', function() {
    const cityInput = document.getElementById('city-input');
    if (!cityInput.classList.contains('show')) {
        cityInput.classList.add('show');
        cityInput.focus();
    } else {
        fetchWeatherData();
    }
});

document.getElementById('city-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        fetchWeatherData();
    }
});

function fetchWeatherData(city = null) {
    if (!city) {
        city = document.getElementById('city-input').value.trim();
    }
    const apiKey = 'dbd29ef2ad3253512c05077bfdf4b696'; // Replace with your actual OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            const weatherData = {
                temperature: Math.round(data.main.temp),
                description: data.weather[0].description,
                icon: getCustomIconPath(data.weather[0].icon),
                timezone: data.timezone // Get the timezone offset
            };
            displayWeather(weatherData);
            displayLocation(city);
            displayCurrentTime(weatherData.timezone);
            document.getElementById('error-message').innerText = '';
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            document.getElementById('error-message').innerText = 'City not found. Please try again.';
            clearWeatherData();
        });
}

function getCustomIconPath(weatherIcon) {
    const iconMapping = {
        '01d': 'images/clear-day.png',
        '01n': 'images/clear-night.png',
        '02d': 'images/partly-cloud-day.png',
        '02n': 'images/partly-cloud-night.png',
        '03d': 'images/cloudy-icon.png',
        '03n': 'images/cloudy-icon.png',
        '04d': 'images/overcast.png',
        '04n': 'images/overcast.png',
        '09d': 'images/rain-shower.png',
        '09n': 'images/rain-shower.png',
        '10d': 'images/rain.png',
        '10n': 'images/rain.png',
        '11d': 'images/thunderstorm.png',
        '11n': 'images/thunderstorm.png',
        '13d': 'images/snow.png',
        '13n': 'images/snow.png',
        '50d': 'images/mist.png',
        '50n': 'images/mist.png'
    };

    return iconMapping[weatherIcon] || 'images/cloudy.png';
}

function displayWeather(weatherData) {
    document.getElementById('temperature').innerText = `${weatherData.temperature}°C`;
    document.getElementById('description').innerText = weatherData.description;
    document.getElementById('icon').src = weatherData.icon;
}

function displayLocation(city) {
    document.getElementById('city-name').innerText = city;
}

function displayCurrentTime(timezoneOffset) {
    const now = new Date();
    const utcOffset = now.getTimezoneOffset() * 60; // Convert from minutes to seconds
    const localTime = new Date((now.getTime() / 1000 + utcOffset + timezoneOffset) * 1000); // Convert to milliseconds
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    };
    const formattedDate = localTime.toLocaleString('en-US', options).replace(', ', ' ');
    document.getElementById('time').innerText = formattedDate;
}

function clearWeatherData() {
    document.getElementById('temperature').innerText = '';
    document.getElementById('description').innerText = '';
    document.getElementById('icon').src = '';
    document.getElementById('city-name').innerText = '';
    document.getElementById('time').innerText = '';
}
