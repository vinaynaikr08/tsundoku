export namespace GoogleBooksAPI {
  export function searchBook(title: string): any {
    return fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}`,
    )
      .then((res) => {
        res
          .json()
          .then((res_json) => {
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
