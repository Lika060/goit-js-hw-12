import { fetchImages } from './js/pixabay-api';
import { renderGallery, clearGallery, showLoader, hideLoader, showError } from './render-functions';
import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loader = document.getElementById('loader');
let currentPage = 1;
let searchQuery = '';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  searchQuery = e.target.elements['search-text'].value.trim();
  
  if (searchQuery === '') {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query!',
    });
    return;
  }
  showLoader(loader);

  try {
    clearGallery(gallery);
    currentPage = 1;

    const data = await fetchImages(searchQuery, currentPage);

    if (data.hits.length === 0) {
      showError('Sorry, there are no images matching your search query. Please try again!');
    } else {
      renderGallery(data.hits, gallery);
      
      const lightbox = new SimpleLightbox('.gallery a');
      lightbox.refresh();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong! Please try again.',
    });
  } finally {
    hideLoader(loader);
  }
});

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    currentPage += 1;
    fetchImages(searchQuery, currentPage).then(data => {
      if (data.hits.length > 0) {
        renderGallery(data.hits, gallery);
        const lightbox = new SimpleLightbox('.gallery a');
        lightbox.refresh();
      }
    });
  }
});
