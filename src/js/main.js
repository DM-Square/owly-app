import emitter from "./eventEmitter.js";
import {
  setupSearchController,
  enableSearchButton,
  disableSearchButton,
} from "./searchController.js";
import {
  setCurrentBooks,
  getCurrentBooks,
  setCurrentSubject,
  getCurrentSubject,
} from "./stateManager.js";
import {
  hideAlerts,
  showMessage,
  showLoadingMessage,
  renderBooks,
  createBookDetails,
  showSearchResultsTitle,
  getDOM,
} from "./UIRenderer.js";
import "../scss/style.scss";

// Inizializzazione search controller

setupSearchController();

// Observers

emitter.on("loadingStart", () => {
  showLoadingMessage();
  hideAlerts();
  disableSearchButton();
});

emitter.on("booksLoaded", ({ books, subject }) => {
  setCurrentBooks(books);
  setCurrentSubject(subject);
  enableSearchButton();

  if (books.length === 0) {
    showMessage(`Nessun libro trovato per "<b>${subject}</b>".`, true);
    return;
  }

  hideAlerts();
  showSearchResultsTitle(subject);
  renderBooks(books);
});

emitter.on("fetchError", ({ errorMessage }) => {
  enableSearchButton();
  showMessage(errorMessage, false);
});

emitter.on("bookDetailsLoaded", (bookDetails) => {
  if (!bookDetails) {
    alert("Errore nel recupero dei dettagli del libro.");
    return;
  }
  hideAlerts();

  const DOM = getDOM();
  DOM.bookList.innerHTML = "";
  DOM.bookList.appendChild(
    createBookDetails(bookDetails, () => {
      showSearchResultsTitle(getCurrentSubject());
      renderBooks(getCurrentBooks());
    }, ["title", "cover", "description"]),
  );
});
