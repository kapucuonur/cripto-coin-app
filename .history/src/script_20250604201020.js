const search = document.getElementById('coin')
const buton = document.querySelector('.btn')
const row = document.querySelector('.row')
const changed = document.querySelector('.changed')

let coinNames = []

const getCoins = async () => {
    const BASE_URL = 'https://api.coinranking.com/v2'
    const API_KEY = 'coinrankinge579fa975b35c1027a9044045252f2819d1332755ba858f0'
    const query = 'coins'
    const URL = `${BASE_URL}/${query}`

    try {
        const res = await fetch(URL)

        if (!res.ok) {
            throw new Error('Hata var')
        }

        const request = await res.json()

    
        coinNames = request.data.coins.map(coin => coin.name.toLowerCase())

        displayCoins(request);
    } catch {
        console.log('Hata');
    }
}

const displayCoins = (request) => {
    const { data: { coins } } = request;

    buton.addEventListener('click', (e) => {
        e.preventDefault()

        const searchValue = search.value.trim().toLowerCase()

        // isim yoksa
        if (!coinNames.includes(searchValue)) {
            //! sweetalert
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'The searched coin could not be found!'
            })
            search.value = ''
            return
        }

        
        coins.forEach(coin => {
            const { name, symbol, price, iconUrl, change } = coin

            if (name.toLowerCase() === searchValue) {
                if (row.innerHTML.includes(name)) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: `${name} already exists!`
                    })
                    return
                }

                let changedClass = change > 0 ? 'green' : 'red'
                let fsClass = name.length > 9 ? 'smfontSize' : 'fs-3'

                row.innerHTML += `
                    <div class= "col-6 col-md-3 d-flex flex-column align-items-center border py-3 position-relative coin-box rounded-5">
                        <span class="close text-white">x</span>
                        <div class="coin_name position-relative">
                            <p class="position-relative fs-3 text-bg-dark rounded-5 px-3 ${fsClass}" >${name}
                                <span class="position-absolute badge text-white bg-warning symbol rounded-5">${symbol}</span>
                            </p>
                        </div>
                        <div class="price fs-4 fw-bold">
                            <p>$${Number(price).toFixed(4)}</p>
                        </div>
                        <div class="icon w-100 d-flex justify-content-center align-items-center">
                            <img class="w-50" src="${iconUrl}" alt="">
                        </div>
                        <div class="changed ${changedClass} mt-3">
                            <i class="fa-solid fa-chart-line"></i>  ${change} %
                        </div>
                    </div>
                `

                search.value = ''
                return
            }
        })
    })
}

getCoins()

// Close
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close')) {
        e.target.closest('.coin-box').remove();
    }
})