import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
let lightbox;

export const createMarkup = images => {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <li class="gallery-item">
        <a class="gallery-link" href="${largeImageURL}">
          <img class="gallery-image" src="${webformatURL}" alt="${tags}" width="360" />
        </a>
        <div class="thumb-block">
          <div class="block"><h2 class="title">Likes</h2><p class="amount">${likes}</p></div>
          <div class="block"><h2 class="title">Views</h2><p class="amount">${views}</p></div>
          <div class="block"><h2 class="title">Comments</h2><p class="amount">${comments}</p></div>
          <div class="block"><h2 class="title">Downloads</h2><p class="amount">${downloads}</p></div>
        </div>
      </li>`
    )
    .join('');
};

export function renderGallery(images, append = false) {
  const markup = createMarkup(images);

  if (append) {
    gallery.insertAdjacentHTML('beforeend', markup);
    if (lightbox) lightbox.refresh();
  } else {
    gallery.innerHTML = markup;
    if (lightbox) lightbox.destroy();
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    }); 
  }
}

export function clearGallery() {
  gallery.innerHTML = '';
  if (lightbox) {
    lightbox.destroy();
    lightbox = null;
  }
}

