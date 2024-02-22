import axios from "axios";
import Notiflix from "notiflix";
import Simplelightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { BASE_URL, options } from "./pixabay-api";

const form = document.getElementById("search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
let page = 1;

const lightbox = new SimpleLightbox('[data-lightbox="gallery-item"]');

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const searchQuery = form.searchQuery.value.trim();
  if (searchQuery === "") return;

  page = 1; // Reset page to 1 for new search
  loadMoreBtn.style.display = "none"; // Hide load more button
  gallery.innerHTML = ""; // Clear gallery

  options.params.q = searchQuery;
  options.params.page = 1;
  await searchImages();
});

loadMoreBtn.addEventListener("click", async () => {
  const searchQuery = form.searchQuery.value.trim();
  if (searchQuery === "") return;

  page++; // Increment page for pagination
  options.params.page = page;
  await searchImages();
});

async function searchImages() {
  try {
    const response = await axios.get(BASE_URL, {
      params: options.params
    });

    const { data } = response;
    const { hits, totalHits } = data;

    if (hits.length === 0) {
      Notiflix.Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
      return;
    }

    hits.forEach((hit) => {
      const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = hit;
      const card = document.createElement("div");
      card.classList.add("photo-card");
      card.innerHTML = `
        <a href="${largeImageURL}" data-lightbox="gallery-item">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${likes}</p>
          <p class="info-item"><b>Views:</b> ${views}</p>
          <p class="info-item"><b>Comments:</b> ${comments}</p>
          <p class="info-item"><b>Downloads:</b> ${downloads}</p>
        </div>
      `;
      gallery.appendChild(card);
    });

    if (totalHits && page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    if (hits.length < 40 || (totalHits && hits.length >= totalHits)) {
      loadMoreBtn.style.display = "none";
      Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
    } else {
      loadMoreBtn.style.display = "block";
    }

    lightbox.refresh();

  } catch (error) {
    console.error("Error fetching images:", error);
  }
}