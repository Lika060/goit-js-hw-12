import { getPictures } from './js/pixabay-api.js'; 
import { createMarkup } from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('#load-more');
const container = document.querySelector('.container');

let searchQuery = '';
let page = 1;
let totalHits = 0;
let lightbox;

function initializeLightbox() {
  if (lightbox) {
    lightbox.destroy();
  }
  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function toggleLoader(show) {
  loader.style.display = show ? 'block' : 'none';
}

function toggleLoadMoreBtn(show) {
  loadMoreBtn.style.display = show ? 'block' : 'none';
}

function showEndMessage() {
  iziToast.info({
    title: 'Info',
    message: "We're sorry, but you've reached the end of search results.",
    position: 'bottomCenter',
    timeout: 5000,
    close: true,
    progressBar: true,
  });
}

function removeEndMessage() {
  const endMessage = document.querySelector('.end-message');
  if (endMessage) {
    endMessage.remove();
  }
}

async function handleSearch(event) {
  event.preventDefault();
  searchQuery = event.target.elements['search-text'].value.trim();
  
  if (!searchQuery) return;

  page = 1;
  gallery.innerHTML = '';
  toggleLoadMoreBtn(false);
  removeEndMessage();
  toggleLoader(true);

  try {
    const data = await getPictures(searchQuery, page);
    totalHits = data.totalHits;
    
    if (data.hits.length === 0) {
      iziToast.warning({
        title: 'Warning',
        message: 'Sorry, there are no images matching your search query. Please try again.',
        position: 'topRight',
      });
      toggleLoader(false);
      return;
    }

    gallery.innerHTML = createMarkup(data.hits);
    initializeLightbox();
    toggleLoader(false);
    
    if (data.hits.length < 15 || page * 15 >= totalHits) {
      toggleLoadMoreBtn(false);
      if (page * 15 >= totalHits) showEndMessage();
    } else {
      toggleLoadMoreBtn(true);
    }
  } catch (error) {
  iziToast.error({
    title: 'Error',
    message: 'Something went wrong. Please try again later.',
    position: 'topRight',
  });
  toggleLoader(false);
}
}

async function handleLoadMore() {
  page += 1;
  toggleLoader(true);
  toggleLoadMoreBtn(false);

  try {
    const data = await getPictures(searchQuery, page);
    gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
    lightbox.refresh();
    toggleLoader(false);

    const { height: cardHeight } = gallery
      .querySelector('.gallery-item')
      .getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (data.hits.length < 15 || page * 15 >= totalHits) {
      toggleLoadMoreBtn(false);
      showEndMessage();
    } else {
      toggleLoadMoreBtn(true);
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
    toggleLoader(false);
  }
}

form.addEventListener('submit', handleSearch);
loadMoreBtn.addEventListener('click', handleLoadMore);

toggleLoadMoreBtn(false);