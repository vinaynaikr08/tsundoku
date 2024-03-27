import { Account, Databases, Query } from "appwrite";

import { client } from "@/appwrite";
import { BACKEND_API_BOOK_SEARCH_URL } from "./Constants/URLs";
import ID from "./Constants/ID";

const account = new Account(client);
const databases = new Databases(client);

export default class Backend {
  public async totalSearch(param: string): Promise<any> {
    let books = [
      ...(await this.bookSearch(param)),
      ...(await this.authorSearch(param)),
      ...(await this.isbnSearch(param)),
    ];

    // Search does not guarantee uniqueness, so we must filter out duplicates
    return [...new Map(books.map((v) => [v.id, v])).values()];
  }

  public async bookSearch(title: string): Promise<any> {
    const res = await fetch(
      `${BACKEND_API_BOOK_SEARCH_URL}?` + new URLSearchParams({ title }),
    );
    return (await res.json()).results.documents.map((doc) => {
      return {
        id: doc.$id,
        title: doc.title,
        author: doc.authors[0].name,
        summary: doc.description,
        image_url: doc.editions[0].thumbnail_url,
        isbn_10: doc.editions[0].isbn_10,
        isbn_13: doc.editions[0].isbn_13,
        genre: doc.genre,
      };
    });
  }

  public async authorSearch(name: string): Promise<any> {
    let books = [];
    const author_docs = (
      await databases.listDocuments(ID.mainDBID, ID.authorCollectionID, [
        Query.search("name", name),
      ])
    ).documents;

    for (const author_doc of author_docs) {
      for (const book_doc of author_doc.books) {
        books = [
          ...books,
          {
            id: book_doc.$id,
            title: book_doc.title,
            author: author_doc.name,
            summary: book_doc.description,
            image_url: book_doc.editions[0].thumbnail_url,
            isbn_10: book_doc.editions[0].isbn_10,
            isbn_13: book_doc.editions[0].isbn_13,
            genre: book_doc.genre,
          },
        ];
      }
    }

    return books;
  }

  public async isbnSearch(param: string): Promise<any> {
    let books = [];
    const edition_docs = (
      await databases.listDocuments(ID.mainDBID, ID.editionCollectionID, [
        Query.or([
          Query.search("isbn_13", param),
          Query.search("isbn_10", param),
        ]),
      ])
    ).documents;

    for (const edition_doc of edition_docs) {
      books = [
        ...books,
        {
          id: edition_doc.books.$id,
          title: edition_doc.books.title,
          author: edition_doc.books.authors[0].name,
          summary: edition_doc.books.description,
          image_url: edition_doc.thumbnail_url,
          isbn_10: edition_doc.isbn_10,
          isbn_13: edition_doc.isbn_13,
          genre: edition_doc.books.genre,
        },
      ];
    }
    return books;
  }

  public async getBooksOfStatus(status: string): Promise<any> {
    let books = [];
    let user_id = (await account.get()).$id;

    const bookstat_docs = (
      await databases.listDocuments(ID.mainDBID, ID.bookStatusCollectionID, [
        Query.equal("user_id", user_id),
        Query.equal("status", status),
      ])
    ).documents;

    for (const bookstat_doc of bookstat_docs) {
      const book_data = await databases.getDocument(
        ID.mainDBID,
        ID.bookCollectionID,
        bookstat_doc.book.$id,
      );

      books.push({
        id: book_data.$id,
        title: book_data.title,
        author: book_data.authors[0].name,
        summary: book_data.description,
        image_url: book_data.editions[0].thumbnail_url,
        isbn: book_data.editions[0].isbn_13,
        genre: book_data.genre,
      });
    }

    return books;
  }
}
