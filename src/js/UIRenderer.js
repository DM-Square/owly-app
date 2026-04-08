// UIRenderer - Modulo di rendering dell'interfaccia

const DOM = {
  bookList: document.getElementById("searchResults"),
  searchAlert: document.getElementById("searchAlert"),
  searchResultsTitle: document.getElementById("searchResultsTitle"),
  searchButton: document.getElementById("searchButton"),
  searchInput: document.getElementById("searchInput"),
};

function truncateDescription(description, maxLength = 1000) {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength) + "...";
}

export function createBookItem(book) {
  const bookItem = document.createElement("div");
  bookItem.className = "bookItem";
  bookItem.dataset.workKey = book.key || "Sconosciuto";
  bookItem.innerHTML = `
    <div class="bookInfo">
      <h3>${book.title || "Titolo non disponibile"}</h3>
      <p class="bookAuthor">by ${book.authors?.map((a) => a.name).join(", ") || "Autore non trovato"}</p>
    </div>
    <div class="bookAction">
      <span>Dettagli →</span>
    </div>
  `;
  return bookItem;
}

// Field mapper per i campi dei dettagli del libro

const fieldMapper = {
  title: (data) => ({
    label: "Titolo",
    value: data.title || "N/A",
    className: "field-title",
    template: (value) => `<h2>${value}</h2>`,
  }),

  cover: (data) => ({
    label: null,
    value: data.covers ? data.covers[0] : "placeholder",
    className: "field-cover",
    isImage: true,
    template: (value, bookData) => `
      <img
        src="https://covers.openlibrary.org/b/id/${value}-M.jpg"
        alt="Copertina di ${bookData.title}"
        class="bookCover"
      />
    `,
  }),

  description: (data) => ({
    label: "Descrizione",
    value: data.description
      ? truncateDescription(
          typeof data.description === "string"
            ? data.description
            : data.description.value,
        )
      : "Nessuna descrizione disponibile.",
    className: "field-description",
    template: (value) => `
      <h3 class="bookDescriptionTitle">Descrizione</h3>
      <p class="bookDescription">${value}</p>
    `,
  }),
};

// Funzione per renderizzare un campo specificato nel fieldMapper

function renderField(fieldName, data) {
  const fieldConfig = fieldMapper[fieldName];
  if (!fieldConfig) {
    console.warn(`Campo "${fieldName}" non trovato nel fieldMapper`);
    return "";
  }

  const { value, template, label, className } = fieldConfig(data);

  if (template) {
    return template(value, data);
  }

  return `
    <div class="${className}">
      <h3>${label}</h3>
      <p>${value}</p>
    </div>
  `;
}

export function createBookDetails(
  bookDetails,
  onBackClick,
  fieldsToShow = ["title", "cover", "description"],
) {
  const detailsContainer = document.createElement("div");
  detailsContainer.className = "bookDetails";

  // Renderizza dinamicamente i campi specificati in fieldsToShow

  const fieldsHtml = fieldsToShow
    .map((fieldName) => renderField(fieldName, bookDetails))
    .join("");

  detailsContainer.innerHTML = `
    ${fieldsHtml}
    <button class="backButton">← Indietro</button>
  `;

  detailsContainer
    .querySelector(".backButton")
    .addEventListener("click", onBackClick);

  return detailsContainer;
}

export function clearBookList() {
  DOM.bookList.innerHTML = "";
}

export function renderBooks(books) {
  clearBookList();
  books.forEach((book) => {
    DOM.bookList.appendChild(createBookItem(book));
  });
}

export function showMessage(message, isHtml = false) {
  clearBookList();
  const alertBox = document.createElement("p");
  if (isHtml) {
    alertBox.innerHTML = message;
  } else {
    alertBox.textContent = message;
  }
  alertBox.className = "searchAlert";
  DOM.bookList.appendChild(alertBox);
}

export function showLoadingMessage() {
  clearBookList();
  DOM.bookList.innerHTML = "<p>Sto cercando...</p>";
}

export function hideAlerts() {
  DOM.searchAlert.classList.add("hidden");
  DOM.searchResultsTitle.classList.add("hidden");
}

export function showSearchResultsTitle(subject) {
  DOM.searchResultsTitle.innerHTML = `Risultati della ricerca per "<b>${subject}</b>":`;
  DOM.searchResultsTitle.classList.remove("hidden");
}

export function getDOM() {
  return DOM;
}
