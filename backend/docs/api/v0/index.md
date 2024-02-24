# API - v0

Warning: the v0 endpoints can and will change at any time!

## Book search

`host/api/v0/books/search`

You must supply a search query of name `title`.

Example query: `host/api/v0/books/search?title=turtle+in+paradise`

## Author search

`host/api/v0/author/search`

You must supply a search query of name `name`.

Example query: `host/api/v0/author/search?name=john+green`

## Book Status query/update

`host/api/v0/bookstatus`

This endpoint allows you to query the `BookStatus` documents associated with the user, or update a given `BookStatus` document.

### Querying

Method: `GET`

You must supply a search query of user ID `user_id`.

Example query: `host/api/v0/bookstatus?user_id=a1b2c3d4...`

### Updating

Method: `POST`

You must supply `user_id`, `book_id`, and `status` enum in the body. (Not the search queries!)
