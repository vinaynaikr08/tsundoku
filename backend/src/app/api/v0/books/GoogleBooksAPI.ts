export namespace GoogleBooksAPI {
  export function searchBooks(title: string): any {
    return fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}`,
    )
      .then((res) => {
        res
          .json()
          .then((res_json) => {
            if (
              typeof res_json === "undefined" ||
              typeof res_json.items === "undefined"
            ) {
              throw new Error();
            }
            return res_json.items;
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        throw error;
      });
  }

  export function getBook(id: string): any {
    return fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
      .then((res) => {
        res
          .json()
          .then((res_json) => {
            if (typeof res_json === "undefined") {
              throw new Error();
            }
            return res_json;
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        throw error;
      });
  }
}
