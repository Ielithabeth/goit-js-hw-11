import './css/styles.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchPhotos } from './js/fetchPhotos.js';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-btn'),
}

const { form, gallery, loadBtn } = refs;

let name = '';
let page = 0;

loadBtn.style.display = 'none';

form.addEventListener('submit', onSearchClick);
function onSearchClick(e) {
  e.preventDefault();
  name = e.currentTarget.searchQuery.value;
  console.log("Name: ", name);

  gallery.innerHTML = '';
  page = 1;

  fetchPhotos(name, page)
    .then(name => {
      console.log(name);
      let totalPages = name.totalHits / 40;

      if (name.hits.length > 0) {
        createGallery(name);

        Notiflix.Notify.success(`Hooray! We found ${name.totalHits} images.`);
        new SimpleLightbox('.gallery a');

        if (page < totalPages) {
          loadBtn.style.display = 'block';
        } else if (name.totalHits === 0) {
          loadBtn.style.display = 'none';
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        }
      } else {
        onError();
      }
    })
    .catch(error => console.log('ERROR: ' + error));
}

function onError() {
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  gallery.innerHTML = '';
}

function createGallery(name) {
  const markup = name.hits.map(hit => {
      return `
      <li>
        <div class="photo-wraper">
          <a href="${hit.largeImageURL}">
            <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width="360"/>
          </a>
        </div>

        <ul class="info">
          <li class="info-item">
            <p>🤍</p>
            <span>${hit.likes.toLocaleString()}</span>
          </li>
          <li class="info-item">
            <p>👁‍🗨</p>
            <span>${hit.views.toLocaleString()}</span>
          </li>
          <li class="info-item">
            <p>💬</p>
            <span>${hit.comments.toLocaleString()}</span>
          </li>
          <li class="info-item">
            <p>⏬</p>
            <span>${hit.downloads.toLocaleString()}</span>
          </li>
        </ul>
      </li>
      `
    }).join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

loadBtn.addEventListener('click', onLloadClick);
function onLloadClick() {
  page += 1;
    
  fetchPhotos(name, page)
  .then(name => {
    let totalPages = name.totalHits / 40;
    createGallery(name);
    new SimpleLightbox('.gallery a');

    if (page >= totalPages) {
      loadBtn.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } 
  });
}