import emitter from "./eventEmitter.js";

const apiUrl = `https://openlibrary.org/subjects`;
const bookDetailsCache = new Map(); // Cache per i dettagli dei libri

export async function fetchBooksBySubject(subject) {
  try {
    emitter.emit("loadingStart", subject);
    const response = await fetch(`${apiUrl}/${subject}.json`);
    if (!response.ok) {
      throw new Error(
        `Errore nel recupero dei libri per il genere: ${subject}.`,
      );
    }
    const data = await response.json();
    emitter.emit("booksLoaded", { books: data.works, subject });
  } catch (error) {
    console.error(error);
    emitter.emit("fetchError", {
      errorMessage:
        "Impossibile recuperare i libri. Controlla la tua connessione e riprova.",
    });
  }
}

export async function fetchBookDetails(workKey) {
  try {
    // Controlla la cache prima di effettuare la chiamata API
    if (bookDetailsCache.has(workKey)) {
      emitter.emit("bookDetailsLoaded", bookDetailsCache.get(workKey));
      return;
    }

    const response = await fetch(`https://openlibrary.org${workKey}.json`);
    if (!response.ok) {
      throw new Error(
        `Errore nel recupero dei dettagli del libro per la chiave: ${workKey}.`,
      );
    }
    const data = await response.json();
    bookDetailsCache.set(workKey, data);
    emitter.emit("bookDetailsLoaded", data);
  } catch (error) {
    console.error(error);
    emitter.emit("bookDetailsLoaded", null);
  }
}
