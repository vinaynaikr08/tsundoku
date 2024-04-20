import { Account, Databases, Query } from "appwrite";

import { client } from "@/appwrite";
import { ID as AID } from "appwrite";
import axios from "axios";
import Genres from "./Constants/Genres";
import ID from "./Constants/ID";
import {
  BACKEND_API_BOOK_SEARCH_URL,
  BACKEND_API_READING_CHALLENGES,
  BACKEND_API_URL,
} from "./Constants/URLs";

const account = new Account(client);
const databases = new Databases(client);

class ListNode {
  data: any;
  next: any;
  constructor(data: any) {
    this.data = data;
    this.next = null;
  }
}

export interface Book {
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

interface BookDocument {
  $id: string;
  $collectionId: string;
  $createdAt: string;
  $updatedAt: string;
  $databaseId: string;
  $permissions: string[];
  //authors: array of authordocs // TODO: implement interface
  description: string;
  //editions: Array of editiondocs // TODO: implement interface
  google_books_id: string;
  title: string;
}

interface BookStatusDocument {
  $collectionId: string;
  $createdAt: string;
  $updatedAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[];
  status: string;
  user_id: string;
  book: BookDocument;
}

export default class Backend {
  public swrFetcher = ({ func, arg }: { func: any; arg: any }) => {
    return func(arg);
  };

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

    if (!("results" in res_json)) {
      console.log(
        "Got no results from server while searching for books. Response: ",
        res_json,
      );
      return [];
    }

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
    status?: string | undefined;
    user_id?: string | undefined;
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

  public getWrapped = async ({
    user_id,
    year,
  }: {
    user_id: string | undefined;
    year: number;
  }) => {
    if (user_id === undefined) {
      user_id = (await account.get()).$id;
    }
    const wrapped_docs = (
      await databases.listDocuments(ID.mainDBID, ID.wrappedsCollectionID, [
        Query.and([Query.equal("user_id", user_id), Query.equal("year", year)]),
      ])
    ).documents;
    if (wrapped_docs === undefined) {
      const book_data = this.getBooksOfStatusFromDate({
        status: "READ",
        user_id: user_id,
      });
      const data: any = this.processGenreData(book_data);
      const ret = { year: year, pages: data.pages, genre_arr: data.genres };

      // create document
      await databases.createDocument(
        ID.mainDBID,
        ID.wrappedsCollectionID,
        AID.unique(),
        {
          user_id: user_id,
          year: year,
          pages_read: data.pages,
          genre_one: data.genres[0].index,
          genre_two: data.genres[1].index,
          genre_three: data.genres[2].index,
          genre_four: data.genres[3].index,
          genre_five: data.genres[4].index,
          genre_one_count: data.genres[0].population,
          genre_two_count: data.genres[1].population,
          genre_three_count: data.genres[2].population,
          genre_four_count: data.genres[3].population,
          genre_five_count: data.genres[4].population,
          genre_other_count: data.genres[5].population,
        },
      );
      return ret;
    } else if (wrapped_docs.length == 0) {
      const book_data = await this.getBooksOfStatusFromDate({
        status: "READ",
        user_id: user_id,
      });
      const data: any = this.processGenreData(book_data);
      const ret = { year: year, pages: data.pages, genre_arr: data.genres };

      // create document
      const res = await databases.createDocument(
        ID.mainDBID,
        ID.wrappedsCollectionID,
        AID.unique(),
        {
          user_id: user_id,
          year: year,
          pages_read: data.pages,
          genre_one: data.genres[0].index,
          genre_two: data.genres[1].index,
          genre_three: data.genres[2].index,
          genre_four: data.genres[3].index,
          genre_five: data.genres[4].index,
          genre_one_count: data.genres[0].population,
          genre_two_count: data.genres[1].population,
          genre_three_count: data.genres[2].population,
          genre_four_count: data.genres[3].population,
          genre_five_count: data.genres[4].population,
          genre_other_count: data.genres[5].population,
        },
      );
      return ret;
    } else {
      const genre_arr = [
        {
          index: wrapped_docs[0].genre_one,
          population: wrapped_docs[0].genre_one_count,
        },
        {
          index: wrapped_docs[0].genre_two,
          population: wrapped_docs[0].genre_two_count,
        },
        {
          index: wrapped_docs[0].genre_three,
          population: wrapped_docs[0].genre_three_count,
        },
        {
          index: wrapped_docs[0].genre_four,
          population: wrapped_docs[0].genre_four_count,
        },
        {
          index: wrapped_docs[0].genre_five,
          population: wrapped_docs[0].genre_five_count,
        },
        { name: "Other", population: wrapped_docs[0].genre_other_count },
      ];
      return {
        year: year,
        pages: wrapped_docs[0].pages_read,
        genre_arr: genre_arr,
      };
    }
  };

  private processGenreData(data: any) {
    if (data == undefined) {
      return [];
    }
    const counter = Array(53).fill(0);
    let pages = 0;

    data.forEach((element: any) => {
      pages += element.pages;

      for (let i = 0; i < 53; i++) {
        if (Genres.genres[i] == element.genre) {
          counter[i]++;
        }
      }
    });

    const new_data = Array(6);

    let head = new ListNode({ index: 0, count: counter[0] });

    for (let i = 1; i < 53; i++) {
      const temp = new ListNode({ index: i, count: counter[i] });
      let temp1 = head;
      let prev = head;
      while (temp1 != null) {
        if (temp.data.count > temp1.data.count) {
          break;
        }
        prev = temp1;
        temp1 = temp1.next;
      }
      if (temp1 == null) {
        prev.next = temp;
      } else if (temp1 == head) {
        head = temp;
        temp.next = prev;
      } else {
        temp.next = prev.next;
        prev.next = temp;
      }
    }
    let temp = head;

    let i = 0;

    for (i = 0; i < 5; i++) {
      new_data[i] = {
        index: temp.data.index,
        population: temp.data.count,
      };
      temp = temp.next;
    }

    let count = 0;
    while (temp != null) {
      count += temp.data.count;
      temp = temp.next;
    }
    new_data[5] = {
      name: "Other",
      population: count,
    };

    const thing = { pages: pages, genres: new_data };

    return thing;
  }

  public getBookStatusDocs = async ({
    status,
    user_id,
  }: {
    status?: string | undefined;
    user_id?: string | undefined;
  }): Promise<BookStatusDocument[]> => {
    if (user_id === undefined) {
      user_id = (await account.get()).$id;
    }

    const queries = [Query.equal("user_id", user_id)];

    if (status !== undefined) {
      queries.push(Query.equal("status", status));
    }

    return (
      await databases.listDocuments(
        ID.mainDBID,
        ID.bookStatusCollectionID,
        queries,
      )
    ).documents as unknown as BookStatusDocument[];
    // We do the double-cast here because the `Document` type is missing some fields that we
    // know we *do* have in the Appwrite database.
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

  public getReadingChallenges = async () => {
    const res = await fetch(`${BACKEND_API_READING_CHALLENGES}`, {
      method: "get",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + (await account.createJWT()).jwt,
      }),
    });
    const res_json = await res.json();

    return res_json.results.documents.map(
      (challenge: { name: any; book_count: any; start: any; end: any }) => {
        return {
          name: challenge.name,
          bookCount: challenge.book_count,
          startDate: challenge.start,
          endDate: challenge.end,
        };
      },
    );
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

  public sendNotification = async (
    user_id: string,
    type: any,
    title: string,
    message: string,
  ) => {
    try {
      await databases.createDocument(
        ID.mainDBID,
        ID.notificationDataCenterCollectionID,
        AID.unique(),
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

    await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
      subID: user_id,
      appId: 20878,
      appToken: "sMBFDEdTPOzXb6A2bqP169",
      title: title,
      message: message,
    });
  };
}
