const cityForm = document.querySelector('header form')
const cityInput = document.querySelector('header form input')

const forecastNavigation = document.querySelector('.weather__forecast')
const forecastExpander = document.querySelector('.weather__forecast .weather__open-weather-menu')
const forecastList = document.querySelector('.weather__forecast-menu .weather__forecast-list')

const currentCity = document.querySelector('#weather .weather__city')
const currentTemperature = document.querySelector('#weather .weather__degrees')
const currentClimate = document.querySelector('#weather .weather__climate')

const todayForecastList = document.querySelector('.weather__forecast-list--today')

const mainDisplay = [ currentCity, currentTemperature, currentClimate ]

const changeInfo = (info, data) => {
    if(info == currentCity && !cityInput.value) {
        cityInput.value = data
    }

    info.innerText = data
}

const updateInfos = data => {
    const local = data.cityName || data.name
    const temperature = (data.main ? data.main : data.current).temp.toFixed() + '°'
    const climate = (data.current ? data.current : data).weather[0].main

    const currentInfo = [ local, temperature, climate ]

    currentInfo.forEach((_, index) => changeInfo(mainDisplay[index], currentInfo[index]))
}

const getCurrentTime = () => {
    const currentTime = new Date()
    const currentUnixTime = currentTime.getTime().toString().slice(0, -3)

    return {
        currentTime,
        currentUnixTime
    }
}

const setLocateInfos = () => {
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        const currentLocation = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=bcfaab6c78be19a12909f0a481f4da85`
        const currentClimateData = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&dt=${getCurrentTime().currentUnixTime}&units=metric&appid=bcfaab6c78be19a12909f0a481f4da85`

        fetch(currentLocation)
        .then(res => res.json())
        .then(data => {
            const cityName = data[0].name

            fetch(currentClimateData)
            .then(res => res.json())
            .then(data => {
                data.cityName = cityName

                updateInfos(data)
                addForecastListItems(data)
            })
        })
    })
}

const addForecastListItems = city => {
    let counter = 1
    const cityTime = getCurrentTime()

    todayForecastList.innerHTML = null

    for(let i = cityTime.currentTime.getHours(); i < 24; i++) {
        const forecastedDegrees = getForecastedDegrees(city, counter)
        const icon = getDueForecastIcon(city, counter)
        const time = getForecastTime(i, cityTime.currentTime)

        const template = `
        <li>
            <p class="weather__forecast-degrees">${forecastedDegrees}°</p>
            <img src="${icon}" alt="forecast-icon" />
            <p class="weather__forecast-time">${time}</p>
        </li>
        `

        todayForecastList.innerHTML += template
        counter++
    }

}

const getForecastedDegrees = (city, hoursLeft) => {
    return city.hourly[hoursLeft].temp.toFixed()
}

const getDueForecastIcon = (city, hoursLeft) => {
    return `http://openweathermap.org/img/wn/${city.hourly[hoursLeft].weather[0].icon}.png`
}

const getForecastTime = (hour, cityTime) => {
    if(hour == cityTime.getHours()) {
        return 'Now'
    } else {
        return (hour < 10 ? `0${hour}:00` : `${hour}:00`)
    }
}

const toggleForecastExpansion = () => {
    if(forecastNavigation.getAttribute('aria-expanded') == 'false') {
        forecastNavigation.setAttribute('aria-expanded', 'true')
    } else {
        forecastNavigation.setAttribute('aria-expanded', 'false')
    }
}

forecastList.addEventListener('wheel', e => {
    e.deltaY > 0 ? forecastList.scrollLeft += 100 : forecastList.scrollLeft -= 100
})

cityForm.addEventListener('submit', e => {
    e.preventDefault()

    const location = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&units=metric&appid=bcfaab6c78be19a12909f0a481f4da85`

    fetch(location)
    .then(res => res.json())
    .then(data => {
        const lat = data.coord.lat
        const lon = data.coord.lon

        const climateData = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&dt=${getCurrentTime().currentUnixTime}&units=metric&appid=bcfaab6c78be19a12909f0a481f4da85`

        const cityName = data.name

        fetch(climateData)
        .then(res => res.json())
        .then(data => {
            data.cityName = cityName

            updateInfos(data)
            addForecastListItems(data)
        })
    })
})

setLocateInfos()