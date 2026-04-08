// api - Modulo per fetch dei dati dall'API di OpenLibrary

const apiUrl = `https://openlibrary.org/subjects`;
const bookDetailsCache = new Map();

// Fetch helper

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Errore nel recupero da ${url}`);
  }
  return response.json();
}

export async function fetchBooksBySubject(subject) {
  // Fetch dati
  const data = await fetchJson(`${apiUrl}/${subject}.json`);

  return {
    books: data.works,
    subject: subject,
  };
}

export async function fetchBookDetails(workKey) {
  // Controllo cache
  if (bookDetailsCache.has(workKey)) {
    return bookDetailsCache.get(workKey);
  }

  // Se non in cache: fetch, salva e restituisci
  const data = await fetchJson(`https://openlibrary.org${workKey}.json`);
  bookDetailsCache.set(workKey, data);

  return data;
}
