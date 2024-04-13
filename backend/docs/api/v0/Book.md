??? warning "Unstable API!"

    The v0 endpoints can and will change at any time!

# Book

## Create

`host/api/v0/books`

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

### Method

`POST`

### Body parameters (**required**)

- `title`

### Body parameters (optional)

- `authors`
- `editions`
- `google_books_id`
- `description`
- `genre`

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `401` - if the auth token was not supplied or is invalid

## Search

`host/api/v0/books/search`

### Method

`GET`

### Search query parameters (**required**)

`title`

### Search query parameters (optional)

`simulateAPIFailure` - `true` or `false`

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `503` - if API failure is simulated (or if the API is actually down)

### Example

`host/api/v0/books/search?title=turtle+in+paradise`
