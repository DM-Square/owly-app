import { describe, it, expect, beforeEach, vi } from "vitest";
import { fetchBooksBySubject, fetchBookDetails } from "../api";
import emitter from "../eventEmitter";

// Mocking di eventEmitter per testare le interazioni
vi.mock("../eventEmitter", () => ({
  default: {
    emit: vi.fn(),
    on: vi.fn(),
    observers: {},
  },
}));

// Mocking del fetch globale
global.fetch = vi.fn();

describe("API Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch books by subject and emit booksLoaded event", async () => {
    const mockBooks = [{ title: "Book 1", key: "/works/1" }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ works: mockBooks }),
    });

    await fetchBooksBySubject("fantasy");

    expect(fetch).toHaveBeenCalledWith(
      "https://openlibrary.org/subjects/fantasy.json",
    );
    expect(emitter.emit).toHaveBeenCalledWith("booksLoaded", {
      books: mockBooks,
      subject: "fantasy",
    });
  });

  it("should emit fetchError on API failure for fetchBooksBySubject", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    await fetchBooksBySubject("fantasy");

    expect(emitter.emit).toHaveBeenCalledWith(
      "fetchError",
      expect.objectContaining({
        errorMessage: expect.any(String),
      }),
    );
  });

  it("should fetch book details and emit bookDetailsLoaded event", async () => {
    const mockDetails = { title: "Book 1", description: "A great book" };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDetails,
    });

    await fetchBookDetails("/works/123");

    expect(fetch).toHaveBeenCalledWith(
      "https://openlibrary.org/works/123.json",
    );
    expect(emitter.emit).toHaveBeenCalledWith("bookDetailsLoaded", mockDetails);
  });

  it("should emit bookDetailsLoaded with null on API failure for fetchBookDetails", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    await fetchBookDetails("/works/invalid");

    expect(emitter.emit).toHaveBeenCalledWith("bookDetailsLoaded", null);
  });
});
