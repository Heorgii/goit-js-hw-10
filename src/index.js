import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const body = document.querySelector('body');
const inpEl = document.getElementById('search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;
const cleanMarkup = ref => (ref.innerHTML = '');

function inpHendler(e) {
    const inpText = e.target.value.trim();

    if (!inpText) {
        cleanMarkup(listEl);
        cleanMarkup(infoEl);
        return;
    }

    fetchCountries(inpText).then(data => {
        console.log(data);
        if (data.length > 10) {
            Notify.info("Too many matches found. Please enter a more specific name.");
            return;
        }
        renderMarkup(data);
    })
    .catch(err => {
        cleanMarkup(listEl);
        cleanMarkup(infoEl);
        Notify.failure("Oops, there is no country with that name");
    });
}

function renderMarkup(data) {

    if (data.length === 1) {
        cleanMarkup(listEl);
        const markupInfo = createMarkupInfo(data);
        listEl.innerHTML = markupInfo;
    }

    else {
        cleanMarkup(infoEl);
        const markupList = createMarkupList(data);
        listEl.innerHTML = markupList;
    }
}

function createMarkupList(data) {
    return data
        .map(({ name, flags }) =>
            `<li><img src = "${flags.svg}" alt= "${name.official}" width = "60" height = "70">${name.official} </li>`,
    )
    .join('');
}

function createMarkupInfo(data){

    return data 
        .map(({name, capital, population, flags, languages}) =>
        `<h1 class = "country-name"><img src = "${flags.svg}" alt= "${name.official}" width = "70" height = "70">${name.official}</h1>
        <p><span>Capital</span>: <span class = "info-text">${capital}</span></p>
        <p><span>Population</span>: <span class = "info-text">${population}</span></p>
        <p><span>Languages</span>: <span class = "info-text">${Object.values(languages)}</span></p>`
    );
}

inpEl.addEventListener('input', debounce(inpHendler, DEBOUNCE_DELAY));

inpEl.style.cssText = `
border-radius: 8px;
color: #0089ff;
`;

listEl.style.cssText = `
list-style: none;
`;

body.style.cssText = `
background-color: #5ed3cb75;
`;