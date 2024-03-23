function googleBooksAPIUnavailableError(res_json: any) {
  console.error(
    `The Google Books API returned the following response: ${res_json}`,
  );
  throw new Error("google-books-api-unavailable");
}

export namespace GoogleBooksAPI {
  export async function searchBooks(title: string) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}`,
      );

      const res_json = await res.json();

      if (typeof res_json === "undefined" || !("items" in res_json)) {
        googleBooksAPIUnavailableError(res_json);
      }

      return res_json.items;
    } catch (error) {
      throw error;
    }
  }

  export async function getBook(id: string) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes/${id}`,
      );

      const res_json = await res.json();

      if (typeof res_json === "undefined") {
        googleBooksAPIUnavailableError(res_json);
      }
      return res_json;
    } catch (error) {
      throw error;
    }
  }
}
