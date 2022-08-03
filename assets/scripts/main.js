const currentCity= document.querySelector('#weather .weather__city')
const currentTemperature = document.querySelector('#weather .weather__degrees')
const currentClimate = document.querySelector('#weather .weather__climate')
const forecastNavigation = document.querySelector('.weather__forecast')
const forecastExpander = document.querySelector('.weather__forecast > a')
const forecastList = document.querySelector('.weather__forecast-menu .weather__forecast-list')

const changeCityText = city => {
    currentCity.innerText = city
}

const changeTemperatureText = degrees => {
    currentTemperature.innerText = degrees
}

const changeClimateText = climate => {
    currentClimate.innerText = climate
}

const sendForecastReqs = () => {
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        const city = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=bcfaab6c78be19a12909f0a481f4da85`
        const info = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=hourly,daily&appid=bcfaab6c78be19a12909f0a481f4da85`

        fetch(city)
        .then(res => res.json())
        .then(data => {
            const local = data[0].name
            changeCityText(local)
        })
        
        fetch(info)
        .then(res => res.json())
        .then(data => {
            const temperature = data.current.temp.toFixed() + '°'
            const climate = data.current.weather[0].main

            changeTemperatureText(temperature)
            changeClimateText(climate)
        })
    })
}

sendForecastReqs()

const toggleForecastExpansion = () => {
    if(forecastNavigation.getAttribute('aria-expanded') == 'false') {
        forecastNavigation.setAttribute('aria-expanded', 'true')
        forecastExpander.querySelector('i').style.transform = 'rotate(180deg)'
        forecastExpander.querySelector('span').style.display = 'none'
    } else {
        forecastNavigation.setAttribute('aria-expanded', 'false')
        forecastExpander.querySelector('i').style.transform = 'rotate(0)'
        forecastExpander.querySelector('span').style.display = 'block'
    }
}

forecastExpander.addEventListener('click', e => {
    e.preventDefault()
    toggleForecastExpansion()
})

forecastList.addEventListener('wheel', e => {
    if(e.deltaY > 0) forecastList.scrollLeft += 100
    else forecastList.scrollLeft -= 100

    e.preventDefault()
})