import { unstable_noStore as noStore } from "next/cache";

noStore();

export default {
  MAIN_DB_ID: process.env.mainDBID,
  BOOK_COL_ID: process.env.bookCollectionID,
  AUTHOR_COL_ID: process.env.authorCollectionID,
  EDITION_COL_ID: process.env.editionCollectionID,
  BOOK_STAT_COL_ID: process.env.bookStatusCollectionID,
  REVIEW_COL_ID: process.env.reviewCollectionID,
};
