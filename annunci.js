// NavBar
let myNavbar = document.querySelector('#myNavbar')

window.addEventListener('scroll' , () => {
    if (window.scrollY > 0) {
        myNavbar.style.backgroundColor = 'var(--bianco)'
        myNavbar.classList.add('shadow')
    } else {
        myNavbar.style.backgroundColor =  'var(--bianco)'
        myNavbar.classList.remove('shadow')
    }
})
//Fine NavBar


// Section Annunci e filtri

// CHIAVI API
//Metodo per collegare file Json
fetch('./annunci.json')
.then((response) => response.json())
.then(data => {
let categoryWrapper = document.querySelector('#categoryWrapper');
let cardsWrapperAnn = document.querySelector("#cardsWrapperAnn");

// Funzione per mostrare le card degli annunci per ogni elemento dell'array
function showCards(array){
    cardsWrapperAnn.innerHTML = ''
    array.forEach((element) => {
        let div = document.createElement('div');
        div.classList.add('col-12', 'col-md-4','my-2');
        div.innerHTML = `
        <div class="card announcementCard">
        <div class="card-body">
          <h5 class="card-title fs-2">${troncate(element.name)}</h5>
          <p class="card-text fs-3">${element.price}</p>
          <p class="card-text">${element.category}</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
      </div>
        `
        cardsWrapperAnn.appendChild(div)
    })
}
showCards(data)

//Funzione che ci permette di prendere per ogni oggetto la categoria con il .map
function setCategoryFilter(){
    let categories = data.map((el) => el.category);
//Dato che dopo avere averci preso ogni categoria con il .map le categorie si ripetevano, ci siamo creati in array, con il .includes abbiamo definito le categorie non ripetute e con il .push le abbiamo inserite nell'array vuoto.
    let uniqueCategories = [];
    categories.forEach((category) => {
        if(!uniqueCategories.includes(category)){
            uniqueCategories.push(category)
        }
    })

    // console.log(uniqueCategories);
    //Per ogni categoria non ripetuta abbiamo creato il proprio input RadioButton corrispondente cosi da poter selezionare le categorie, premendo sia sopra il cerchio e sulla scritta.
    uniqueCategories.forEach((uniqueCategory) => {
        let div = document.createElement('div');
        div.classList.add('form-check');
        div.innerHTML = `
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="${uniqueCategory}">
        <label class="form-check-label" for="${uniqueCategory}">
          ${uniqueCategory}
        </label>
        `
        categoryWrapper.appendChild(div)
    })
}

setCategoryFilter()

// Funzione che ci permette di filtrare gli array per categoria
let radioBtns = document.querySelectorAll('.form-check-input');
;

function filterByCategory(array){
    let category =Array.from(radioBtns).find((el) => el.checked).id;
    console.log(category);
    if(category != 'All'){
        let filtered = array.filter((el) => el.category == category)
        return filtered
    } else {
        return array
    }
}

filterByCategory()

//Funzione che ci permette di prendere per ogni oggetto la categoria prezzo
let inputRange = document.querySelector('#inputRange');
let formLabel = document.querySelector('.form-label')


function findMaxPrice(){
    //Con il .map prendo i la cetegoria prezzo di ogni annunci e li trasformo in numeri
    let prices = data.map((el) => Number(el.price))
    //Con il .sort ordino ogni array con i prezzi in ordine decrescente e prendo il prezzo piu alto
    let sorted = prices.sort((a,b) => a - b);
    let maxPrice = Math.ceil(+sorted.pop())

    inputRange.max = maxPrice 
    inputRange.value = maxPrice
    
}
findMaxPrice()

//Funzione che ci permette di filtrare gli array per prezzo
function filterByPrice(array){
    let filtered = array.filter((el) => +el.price <= +inputRange.value)
    let sortedFilter = filtered.sort((a,b) => a.price - b.price)
    return sortedFilter

}

//Funzione che ci permette di filtrare gli array per parola
let inputWord = document.querySelector('#inputWord');

function filterByWord(array){
    let name = inputWord.value
    let filtered = array.filter((el) => el.name.toLowerCase().includes(name.toLowerCase()))
    return filtered
}


function globalFilter(){
    let filteredByCategory = filterByCategory(data);
    let filteredByPrice = filterByPrice(filteredByCategory)
    let filteredByWord = filterByWord(filteredByPrice)

    showCards(filteredByWord)
}

//Funzione che ci permette di trocare il titolo di ogni annuncio quando e troppo lungo
function troncate(string){
    if(string.length > 20){
        return string.split(' ')[0] + '...'
    } else {
        return string
    }
}


//Eventi
radioBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        globalFilter()
    })
})

inputRange.addEventListener('input', () => {
    formLabel.innerHTML = '$' + inputRange.value
    globalFilter()
})

inputWord.addEventListener('input' , () => {
    globalFilter()
})

})



