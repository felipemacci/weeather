const cityForm = document.querySelector('header form')
const cityInput = document.querySelector('header form input')

const forecastNavigation = document.querySelector('.weather__forecast')
const forecastExpander = document.querySelector('.weather__forecast .weather__open-weather-menu')
const forecastList = document.querySelector('.weather__forecast-menu .weather__forecast-list')

const currentCity = document.querySelector('#weather .weather__city')
const currentTemperature = document.querySelector('#weather .weather__degrees')
const currentClimate = document.querySelector('#weather .weather__climate')

const mainDisplay = [ currentCity, currentTemperature, currentClimate ]

const changeInfo = (info, data) => {
    if(info == currentCity && !cityInput.value) {
        cityInput.value = data
    }

    info.innerText = data
}

const updateInfos = (data) => {
    const local = data.name
    const temperature = data.main.temp.toFixed() + '°'
    const climate = data.weather[0].main

    const currentInfo = [ local, temperature, climate ]

    currentInfo.forEach((_, index) => changeInfo(mainDisplay[index], currentInfo[index]))
}

const setLocateInfos = () => {
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        const currentLocation = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=bcfaab6c78be19a12909f0a481f4da85`

        fetch(currentLocation)
        .then(res => res.json())
        .then(data => {
            const city = `https://api.openweathermap.org/data/2.5/weather?q=${data[0].name}&units=metric&appid=bcfaab6c78be19a12909f0a481f4da85`

            fetch(city)
            .then(res => res.json())
            .then(data => updateInfos(data))
        })
    })
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

    const city = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&units=metric&appid=bcfaab6c78be19a12909f0a481f4da85`

    fetch(city)
    .then(res => res.json())
    .then(data => updateInfos(data))
})

setLocateInfos()