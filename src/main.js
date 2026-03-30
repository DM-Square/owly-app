import { fetchBooksBySubject } from "./api.js";

async function displayBooks(subject) {
  const books = await fetchBooksBySubject(subject);
  const bookList = document.getElementById("searchResults");
  bookList.innerHTML = "";

  if (books.length === 0) {
    const alertBox = document.createElement("p");
    alertBox.textContent = "No books found for this subject.";
    alertBox.className = "searchAlert";
    const searchContainer = document.querySelector(".searchContainer");
    searchContainer.appendChild(alertBox);
    return;
  }

  books.forEach((book) => {
    const bookItem = document.createElement("div");
    bookItem.className = "bookItem";
    bookItem.innerHTML = `
      <h3>${book.title}</h3>
      <p class="bookAuthor">by ${book.authors.map((author) => author.name).join(", ")}</p>
      <p class="bookYear">First published: ${book.first_publish_year || "N/A"}</p>
    `;
    bookList.appendChild(bookItem);
  });
}

document.getElementById("searchButton").addEventListener("click", (event) => {
  event.preventDefault();
  const subjectInput = document.getElementById("searchInput");
  const subject = subjectInput.value.trim();
  const existingAlert = document.querySelector(".searchAlert");
  if (existingAlert) {
    existingAlert.remove();
  }
  if (!subject) {
    const alertBox = document.createElement("p");
    alertBox.textContent = "Please enter a book genre.";
    alertBox.className = "searchAlert";
    const searchContainer = document.querySelector(".searchContainer");
    searchContainer.appendChild(alertBox);
    return;
  }
  if (subject) {
    displayBooks(subject);
  }
});

// Enter key event listener for the search input

document.getElementById("searchInput").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("searchButton").click();
  }
});
