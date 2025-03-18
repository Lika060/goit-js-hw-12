import { fetchImages } from "./pixabay-api";
import { renderGallery, clearGallery } from "./render-functions";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector(".form");
const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  const searchQuery = event.target.elements["search-text"].value.trim();
  if (!searchQuery) {
    iziToast.warning({
      title: "Warning",
      message: "Please enter a search term!",
      position: "topRight",
    });
    return;
  }
  
  clearGallery();
  loader.classList.remove("hidden");
  
  try {
    const images = await fetchImages(searchQuery);
    
    if (images.length === 0) {
      iziToast.error({
        title: "Error",
        message: "Sorry, there are no images matching your search query. Please try again!",
        position: "topRight",
      });
    } else {
      renderGallery(images);
    }
  } catch (error) {
    iziToast.error({
      title: "Error",
      message: "Something went wrong. Please try again later!",
      position: "topRight",
    });
  }
  
  loader.classList.add("hidden");
  form.reset();
});