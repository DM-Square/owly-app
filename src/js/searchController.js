// searchController - Modulo per la gestione della logica di ricerca

import { fetchBooksBySubject, fetchBookDetails } from "./api.js";
import emitter from "./eventEmitter.js";
import { getDOM } from "./UIRenderer.js";

const DOM = getDOM();

export function setupSearchController() {
  // Prevent Default del form
  const searchForm = document.querySelector("form");
  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });
  }

  // Click sul pulsante di ricerca

  DOM.searchButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const subject = DOM.searchInput.value.trim();
    DOM.searchInput.value = "";

    if (!subject) {
      DOM.searchAlert.textContent = "Per favore, inserisci un genere di libri.";
      DOM.searchAlert.classList.remove("hidden");
      setTimeout(() => {
        DOM.searchAlert.classList.add("hidden");
      }, 3000);
      return;
    }

    DOM.searchAlert.classList.add("hidden");

    emitter.emit("loadingStart", subject);

    try {
      const result = await fetchBooksBySubject(subject);
      emitter.emit("booksLoaded", result);
    } catch (error) {
      console.error(error);
      enableSearchButton();
      emitter.emit("fetchError", {
        errorMessage:
          "Impossibile recuperare i libri. Controlla la tua connessione e riprova.",
      });
    }
  });

  // Listener per il tasto Enter nell'input di ricerca

  DOM.searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      DOM.searchButton.click();
    }
  });

  // Click su un elemento della lista dei libri (event delegation)

  DOM.bookList.addEventListener("click", async (event) => {
    const bookItem = event.target.closest(".bookItem");
    if (bookItem) {
      const workKey = bookItem.dataset.workKey;

      try {
        const bookDetails = await fetchBookDetails(workKey);
        emitter.emit("bookDetailsLoaded", bookDetails);
      } catch (error) {
        console.error(error);
        emitter.emit("fetchError", {
          errorMessage: "Impossibile recuperare i dettagli del libro. Riprova.",
        });
      }
    }
  });
}

export function disableSearchButton() {
  DOM.searchButton.disabled = true;
}

export function enableSearchButton() {
  DOM.searchButton.disabled = false;
}
