??? warning "Unstable API!"

    The v0 endpoints can and will change at any time!

# Review query/update

`host/api/v0/reviews`

This endpoint allows you to query the `Review` documents associated with the user, or update a given `Review` document.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

## Querying

### Method

`GET`

### Example

`host/api/v0/reviews`

### Returns

- `200` - request was successful
- `401` - if the auth token was not supplied or is invalid

## Updating

### Method

`POST`

### Body parameters (**required**)

- `book_id`
- `star_rating` integer

### Body parameters (optional)

- `description` string

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `401` - if the auth token was not supplied or is invalid

## Updating by ID

`host/api/v0/reviews/[review_id]`

### Method

`PATCH`

### Body parameters (optional)

Note: one of the optional parameters must be supplied.

- `star_rating` integer
- `description` string

### Returns

- `200` - request was successful
- `400` - if none of the optional parameters were supplied
- `401` - if the auth token was not supplied or is invalid
- `404` - if the specified ID does not correspond to a book review entry
