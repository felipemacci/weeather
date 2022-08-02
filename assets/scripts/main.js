import Logo from '../scripts/logo.js'

const forecastNavigation = document.querySelector('.weather__forecast')
const forecastExpander = document.querySelector('.weather__forecast > a')
const forecastList = document.querySelector('.weather__forecast-menu .weather__forecast-list')

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

customElements.define('app-logo', Logo)