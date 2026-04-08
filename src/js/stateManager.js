// stateManager - Modulo per la gestione dello stato dell'app

let currentBooks = [];
let currentSubject = "";

export function setCurrentBooks(books) {
  currentBooks = books;
}

export function getCurrentBooks() {
  return currentBooks;
}

export function setCurrentSubject(subject) {
  currentSubject = subject;
}

export function getCurrentSubject() {
  return currentSubject;
}
