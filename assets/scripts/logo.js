class Logo extends HTMLElement {
    constructor() {
        super()

        this.build()
    }

    build() {
        const shadow = this.attachShadow({ mode: 'open' })

        shadow.appendChild(this.styles())

        const logo = this.createLogo()
        const identity = this.createLogoIdentity()

        logo.appendChild(identity)

        shadow.appendChild(logo)
    }

    createLogo() {
        const logo = document.createElement('div')
        logo.classList.add('logo')
        if(this.getColor() != 'logo--default') logo.classList.add(this.getColor())
        return logo
    }

    createLogoIdentity() {
        const identity = document.createElement('span')
        identity.classList.add('logo__text')
        identity.innerHTML = '<mark>wee</mark>ather'
        return identity
    }

    getColor() {
        let color = this.getAttribute('data-color')
        color = `logo--${color}`
        return color
    }

    styles() {
        const style = document.createElement('style')

        style.textContent = `
        .logo .logo__text {
            font-family: 'M PLUS Rounded 1c', sans-serif;
            font-size: 3rem;
            font-weight: 500;
            color: white;
        }

        .logo .logo__text > mark {
            color: #90E0EF;
            background: none;
        }

        .logo.logo--white .logo__text > mark {
            color: inherit;
        }
        `

        return style
    }
}

export default Logo