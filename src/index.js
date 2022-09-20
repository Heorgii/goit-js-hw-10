import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inpEl = document.getElementById('search-box');
const listEl= document.querySelector('.country-list');
const infoEl= document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

const inpHendler = e =>{
    const inpText = e.target.value.trim();

    if(!inpText){
        cleanMarkup(listEl);
        cleanMarkup(infoEl);
        return;
    }

    fetchCountries(inpText).then(data =>{
        console.log(data);
        if(data.length > 10){
            Notify.info("Too many matches found. Please enter a more specific name.");
            return;
        }
    })
    .catch(err =>{
        cleanMarkup(listEl);
        cleanMarkup(infoEl);
        Notify.failure('')
    });
};

inpEl.addEventListener('input', debounce(inpHendler, DEBOUNCE_DELAY));