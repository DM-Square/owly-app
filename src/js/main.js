import { fetchBooksBySubject, fetchBookDetails } from "./api.js";
import emitter from "./eventEmitter.js";
import "../scss/style.scss";

let currentBooks = []; // Salva la lista corrente di libri per la back navigation

// Cache DOM

const DOM = {
  bookList: document.getElementById("searchResults"),
  searchAlert: document.getElementById("searchAlert"),
  searchResultsTitle: document.getElementById("searchResultsTitle"),
  searchButton: document.getElementById("searchButton"),
  searchInput: document.getElementById("searchInput"),
};

// Funzioni helper

function hideAlerts() {
  DOM.searchAlert.classList.add("hidden");
  DOM.searchResultsTitle.classList.add("hidden");
}

function renderBooks(books) {
  DOM.bookList.innerHTML = "";
  books.forEach((book) => {
    DOM.bookList.appendChild(createBookItem(book));
  });
}

function truncateDescription(description, maxLength = 1000) {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength) + "...";
}

// Observers

emitter.on("loadingStart", () => {
  DOM.bookList.innerHTML = "<p>Sto cercando...</p>";
  hideAlerts();
  DOM.searchButton.disabled = true;
});

emitter.on("booksLoaded", ({ books, subject }) => {
  currentBooks = books;
  hideAlerts();
  DOM.searchButton.disabled = false;

  if (books.length === 0) {
    const alertBox = document.createElement("p");
    alertBox.innerHTML = `Nessun libro trovato per "<b>${subject}</b>".`;
    alertBox.className = "searchAlert";
    DOM.bookList.innerHTML = "";
    DOM.bookList.appendChild(alertBox);
    return;
  }

  DOM.searchResultsTitle.innerHTML = `Risultati della ricerca per "<b>${subject}</b>":`;
  DOM.searchResultsTitle.classList.remove("hidden");
  renderBooks(books);
});

emitter.on("fetchError", ({ errorMessage }) => {
  DOM.searchButton.disabled = false;
  const alertBox = document.createElement("p");
  alertBox.textContent = errorMessage;
  alertBox.className = "searchAlert";
  DOM.bookList.innerHTML = "";
  DOM.bookList.appendChild(alertBox);
});

emitter.on("bookDetailsLoaded", (bookDetails) => {
  if (!bookDetails) {
    alert("Errore nel recupero dei dettagli del libro.");
    return;
  }
  hideAlerts();
  DOM.bookList.innerHTML = "";
  DOM.bookList.appendChild(createBookDetails(bookDetails));
});

// Helper DOM

function createBookItem(book) {
  const bookItem = document.createElement("div");
  bookItem.className = "bookItem";
  bookItem.dataset.workKey = book.key;
  bookItem.innerHTML = `
    <div class="bookInfo">
      <h3>${book.title}</h3>
      <p class="bookAuthor">by ${book.authors.map((a) => a.name).join(", ")}</p>
    </div>
    <div class="bookAction">
      <span>Dettagli →</span>
    </div>
  `;
  return bookItem;
}

function createBookDetails(bookDetails) {
  const detailsContainer = document.createElement("div");
  detailsContainer.className = "bookDetails";
  detailsContainer.innerHTML = `
    <h2>${bookDetails.title}</h2>
    <img src="https://covers.openlibrary.org/b/id/${bookDetails.covers ? bookDetails.covers[0] : "placeholder"}-M.jpg" alt="${bookDetails.title} cover" class="bookCover" />
    <h3 class="bookDescriptionTitle">Descrizione</h3>
    <p class="bookDescription">${bookDetails.description ? truncateDescription(typeof bookDetails.description === "string" ? bookDetails.description : bookDetails.description.value) : "Nessuna descrizione disponibile."}</p>
    <button class="backButton">← Indietro</button>
  `;

  detailsContainer
    .querySelector(".backButton")
    .addEventListener("click", () => {
      DOM.searchResultsTitle.classList.remove("hidden");
      renderBooks(currentBooks);
    });

  return detailsContainer;
}

// Event Listener

DOM.searchButton.addEventListener("click", (event) => {
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
  fetchBooksBySubject(subject);
});

DOM.searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    DOM.searchButton.click();
  }
});

DOM.bookList.addEventListener("click", (event) => {
  const bookItem = event.target.closest(".bookItem");
  if (bookItem) {
    fetchBookDetails(bookItem.dataset.workKey);
  }
});
