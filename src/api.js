const apiUrl = `https://openlibrary.org/subjects`;

export async function fetchBooksBySubject(subject) {
  try {
    const loadingText = document.createElement("p");
    loadingText.textContent = "Loading...";
    const bookList = document.getElementById("searchResults");
    bookList.innerHTML = "";
    bookList.appendChild(loadingText);
    const response = await fetch(`${apiUrl}/${subject}.json`);
    if (!response.ok) {
      throw new Error(`Error fetching books for subject: ${subject}.`);
    }
    const data = await response.json();
    loadingText.remove();
    return data.works;
  } catch (error) {
    console.error(error);
    return [];
  }
}
