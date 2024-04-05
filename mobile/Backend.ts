import { Account, Databases, Query } from "appwrite";

import { client } from "@/appwrite";
import { BACKEND_API_BOOK_SEARCH_URL, BACKEND_API_URL } from "./Constants/URLs";
import ID from "./Constants/ID";
import { ID as UID } from "appwrite";
import axios from "axios";

const account = new Account(client);
const databases = new Databases(client);

interface Book {
  id: string;
  title: string;
  author: string;
  summary: string;
  image_url: string;
  isbn_10: string;
  isbn_13: string;
  genre: string;
}

interface BookSearchAPIResponse {
  message: string;
  results: BookSearchAPIResponseResult;
}

interface BookSearchAPIResponseResult {
  total: number;
  documents: BookSearchAPIResponseDocument[];
}

interface BookSearchAPIResponseDocument {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  google_books_id: string;
  description: string;
  authors: BookSearchAPIResponseDocumentAuthor[];
  editions: BookSearchAPIResponseDocumentEdition[];
  genre: string;
}

interface BookSearchAPIResponseDocumentAuthor {
  name: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
}

interface BookSearchAPIResponseDocumentEdition {
  page_count: number;
  publisher: string;
  thumbnail_url: string;
  isbn_10: string;
  isbn_13: string;
}

interface AuthorSearchAppwriteResponseDocument {
  name: string;
  books: AuthorSearchAppwriteResponseDocumentBook[];
}

interface AuthorSearchAppwriteResponseDocumentBook {
  $id: string;
  title: string;
  description: string;
  editions: AuthorSearchAppwriteResponseDocumentEdition[];
  genre: string;
}

interface AuthorSearchAppwriteResponseDocumentEdition {
  page_count: number;
  publisher: string;
  thumbnail_url: string;
  isbn_10: string;
  isbn_13: string;
}

interface ISBNSearchAppwriteResponseDocument {
  books: ISBNSearchAppwriteResponseDocumentBook;
  thumbnail_url: string;
  isbn_10: string;
  isbn_13: string;
}

interface ISBNSearchAppwriteResponseDocumentBook {
  $id: string;
  title: string;
  authors: ISBNSearchAppwriteResponseDocumentAuthor[];
  description: string;
  genre: string;
}

interface ISBNSearchAppwriteResponseDocumentAuthor {
  name: string;
}

export default class Backend {
  public totalSearch = async (param: string): Promise<Book[]> => {
    const books = [
      ...(await this.bookSearch(param)),
      ...(await this.authorSearch(param)),
      ...(await this.isbnSearch(param)),
    ];

    // Search does not guarantee uniqueness, so we must filter out duplicates
    return [...new Map(books.map((v) => [v.id, v])).values()];
  };

  public bookSearch = async (title: string): Promise<Book[]> => {
    const res = await fetch(
      `${BACKEND_API_BOOK_SEARCH_URL}?${new URLSearchParams({ title }).toString()}`,
    );
    const res_json = (await res.json()) as BookSearchAPIResponse;

    const books = res_json.results.documents.map(
      (doc: BookSearchAPIResponseDocument) => ({
        id: doc.$id,
        title: doc.title,
        author: doc.authors[0].name,
        summary: doc.description,
        image_url: doc.editions[0].thumbnail_url,
        isbn_10: doc.editions[0].isbn_10,
        isbn_13: doc.editions[0].isbn_13,
        genre: doc.genre,
      }),
    );

    return books;
  };

  public authorSearch = async (name: string): Promise<Book[]> => {
    let books: Book[] = [];
    const author_docs = (
      await databases.listDocuments(ID.mainDBID, ID.authorCollectionID, [
        Query.search("name", name),
      ])
    ).documents as unknown as AuthorSearchAppwriteResponseDocument[];

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
  };

  public isbnSearch = async (param: string): Promise<Book[]> => {
    let books: Book[] = [];
    const edition_docs = (
      await databases.listDocuments(ID.mainDBID, ID.editionCollectionID, [
        Query.or([
          Query.search("isbn_13", param),
          Query.search("isbn_10", param),
        ]),
      ])
    ).documents as unknown as ISBNSearchAppwriteResponseDocument[];

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
  };

  public getBookStatuses = async ({
    status,
    user_id,
  }: {
    status: string;
    user_id: string | undefined;
  }) => {
    const books = [];
    if (user_id === undefined) {
      user_id = await this.getUserId();
    }

    const bookstat_docs = await this.getBookStatusDocs({ status, user_id });

    for (const bookstat_doc of bookstat_docs) {
      books.push(await this.getBookData(bookstat_doc.book.$id as string));
    }

    return books;
  };

  public getUserId = async () => {
    return (await account.get()).$id;
  };

  public getBooksOfStatusFromDate = async ({
    status,
    user_id,
  }: {
    status: string;
    user_id: string | undefined;
  }) => {
    const books = [];
    if (user_id === undefined) {
      user_id = (await account.get()).$id;
    }
    const cutoff = new Date(new Date().getFullYear(), 0, 1);

    const bookstat_docs = await this.getBookStatusDocs({ status, user_id });

    for (const bookstat_doc of bookstat_docs) {
      const formatted_date = new Date(bookstat_doc.$updatedAt);
      if (formatted_date < cutoff) {
        continue;
      }

      books.push(await this.getBookData(bookstat_doc.book.$id));
    }

    return books;
  };

  public getBookStatusDocs = async ({
    status,
    user_id,
  }: {
    status: string;
    user_id: string | undefined;
  }) => {
    if (user_id === undefined) {
      user_id = (await account.get()).$id;
    }

    return (
      await databases.listDocuments(ID.mainDBID, ID.bookStatusCollectionID, [
        Query.equal("user_id", user_id),
        Query.equal("status", status),
      ])
    ).documents;
  };

  public getBookData = async (id: string) => {
    const book_data = await databases.getDocument(
      ID.mainDBID,
      ID.bookCollectionID,
      id,
    );

    return {
      id: book_data.$id,
      title: book_data.title,
      author: book_data.authors[0].name,
      summary: book_data.description,
      image_url: book_data.editions[0].thumbnail_url,
      isbn: book_data.editions[0].isbn_13,
      genre: book_data.genre,
      pages: book_data.editions[0].page_count,
    };
  };

  public getUsername = async ({ user_id }: { user_id: string | undefined }) => {
    if (user_id === undefined) {
      user_id = (await account.get()).$id;
    }

    const response = await fetch(
      `${BACKEND_API_URL}/v0/users/${user_id}/name`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await account.createJWT()).jwt,
        }),
      },
    );

    return (await response.json()).name;
  };

  public getAccountName = async () => {
    return (await account.get()).name;
  };

  public sendNotification = (user_id, type, title, message) => {
    try {
      // TODO: this should be an await call
      databases.createDocument(
        ID.mainDBID,
        ID.notificationDataCenterCollectionID,
        UID.unique(),
        {
          user_id: user_id,
          type: type,
          title: title,
          description: message,
        },
      );
    } catch (error) {
      console.log(error);
    }

    axios.post(`https://app.nativenotify.com/api/indie/notification`, {
      subID: user_id,
      appId: 20437,
      appToken: "yoXi9lQ377rDWZeu0R8IdW",
      title: title,
      message: message,
    });
  };
}
