const cityForm = document.querySelector('header form')
const cityInput = document.querySelector('header form input')

const forecastNavigation = document.querySelector('.weather__forecast')
const forecastExpander = document.querySelector('.weather__forecast .weather__open-weather-menu')
const forecastList = document.querySelectorAll('.weather__forecast-menu .weather__forecast-list')
const forecastListChanger = document.querySelectorAll('#weather .weather__forecast-menu .weather__choose-day li a')
const todayForecastList = document.querySelector('.weather__forecast-list--today')
const tomorrowForecastList = document.querySelector('.weather__forecast-list--tomorrow')

const currentCity = document.querySelector('#weather .weather__city')
const currentTemperature = document.querySelector('#weather .weather__degrees')
const currentClimate = document.querySelector('#weather .weather__climate')

const mainSection = document.getElementById('weather')
const mainDisplay = [ currentCity, currentTemperature, currentClimate ]

const setLocateInfos = () => {
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        const currentLocation = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=bcfaab6c78be19a12909f0a481f4da85`
        const currentClimateData = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=bcfaab6c78be19a12909f0a481f4da85`

        axios.get(currentLocation)
        .then(res => {
            const cityName = res.data[0].name

            axios.get(currentClimateData)
            .then(res => {
                const data = res.data
                data.cityName = cityName

                handleForecastInfo(data)
            })
            .catch(error => setError(error))
        })
        .catch(error => setError(error))
    })
}

const handleForecastInfo = city => {
    const cityTime = getCurrentTime(city)

    updateInfos(city)
    setTimeBackground(cityTime)
    createForecastListItems(city, cityTime)
}

const getCurrentTime = data => {
    let currentTime = new Date().toLocaleString('pt-BR', { timeZone: data.timezone })
    currentTime = parseInt(currentTime.split(' ')[1].slice(0, 2))

    return currentTime
}

const updateInfos = data => {
    const local = data.cityName || data.name
    const temperature = (data.main ? data.main : data.current).temp.toFixed() + '°'
    const climate = (data.current ? data.current : data).weather[0].main

    const currentInfo = [ local, temperature, climate ]

    currentInfo.forEach((_, index) => changeInfo(mainDisplay[index], currentInfo[index]))
}

const changeInfo = (info, data) => {
    if(info == currentCity && !cityInput.value) {
        cityInput.value = data
    }

    info.innerText = data
}

const setTimeBackground = time => {
    if(time >= 18) {
        mainSection.style.backgroundImage = 'url("../assets/images/night.jpg")'
    } else if(time >= 12) {
        mainSection.style.backgroundImage = 'url("../assets/images/evening.jpg")'
    } else if(time >= 6) {
        mainSection.style.backgroundImage = 'url("../assets/images/day.jpg")'
    } else {
        mainSection.style.backgroundImage = 'url("../assets/images/dawn.jpg")'
    }
}

const createForecastListItems = (city, cityTime) => {
    let todayCounter = 0
    let tomorrowCounter = 0

    todayForecastList.innerHTML = null
    tomorrowForecastList.innerHTML = null

    for(let i = cityTime; i < 24; i++) {
        const forecastedDegrees = getForecastedDegrees(city, todayCounter)
        const icon = getDueForecastIcon(city, todayCounter)
        const time = getForecastTime(i, cityTime)

        const info = {
            todayForecastList, forecastedDegrees, icon, cityTime, time, i
        }

        addListItem(todayForecastList, info)
        todayCounter++
    }

    for(let i = todayCounter; i < (24 + todayCounter); i++) {
        const forecastedDegrees = getForecastedDegrees(city, i)
        const icon = getDueForecastIcon(city, i)
        const time = getForecastTime(tomorrowCounter, cityTime)

        const info = {
            todayForecastList, forecastedDegrees, icon, cityTime, time, i
        }

        addListItem(tomorrowForecastList, info)
        tomorrowCounter++
    }
}

const getForecastedDegrees = (city, hoursLeft) => {
    return city.hourly[hoursLeft].temp.toFixed()
}

const getDueForecastIcon = (city, hoursLeft) => {
    return `http://openweathermap.org/img/wn/${city.hourly[hoursLeft].weather[0].icon}.png`
}

const getForecastTime = hour => {
    return (hour < 10 ? `0${hour}:00` : `${hour}:00`)
}

const addListItem = (list, info) => {
    const template = `
    <li>
        <p class="weather__forecast-degrees">${info.forecastedDegrees}°</p>
        <img src="${info.icon}" alt="forecast-icon" />
        <p class="weather__forecast-time">${list == todayForecastList ? (info.i != info.cityTime ? info.time : 'Now') : info.time}</p>
    </li>
    `

    list.innerHTML += template
}

const toggleForecastExpansion = () => {
    if(forecastNavigation.getAttribute('aria-expanded') == 'false') {
        forecastNavigation.setAttribute('aria-expanded', 'true')
    } else {
        forecastNavigation.setAttribute('aria-expanded', 'false')
    }
}

const setError = error => {
    if(error.response) {
        switch(error.response.status) {
            case 404:
                alert('City not found!')
                break
            case 429:
                alert('You have exceeded the limit of 1000 daily API calls. If you want to continue using the application, wait until tomorrow or enter a new key.')
                break
            default:
                alert('An unexpected error has occurred! Try again later.')
        }
    }
}

forecastList.forEach(list => {
    list.addEventListener('wheel', e => {
        e.deltaY > 0 ? list.scrollLeft += 100 : list.scrollLeft -= 100
    })
})

cityForm.addEventListener('submit', e => {
    e.preventDefault()

    const location = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&units=metric&appid=bcfaab6c78be19a12909f0a481f4da85`

    axios.get(location)
    .then(res => {
        const data = res.data
        const lat = data.coord.lat
        const lon = data.coord.lon

        const cityName = data.name

        const climateData = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=bcfaab6c78be19a12909f0a481f4da85`
        
        axios.get(climateData)
        .then(res => {
            const data = res.data
            data.cityName = cityName

            handleForecastInfo(data)
        })
        .catch(error => setError(error))
    })
    .catch(error => setError(error))
})

forecastListChanger.forEach(option => {
    option.addEventListener('click', e => {
        e.preventDefault()

        forecastListChanger.forEach(item => item.parentElement.removeAttribute('active'))
        e.target.parentElement.setAttribute('active', '')

        if(e.target.innerText != 'Today') {
            todayForecastList.style.display = 'none'
            tomorrowForecastList.style.display = 'flex'
        } else {
            todayForecastList.style.display = 'flex'
            tomorrowForecastList.style.display = 'none'
        }
    })
})

setLocateInfos()
setTimeBackground()