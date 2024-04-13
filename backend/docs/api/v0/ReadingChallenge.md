??? warning "Unstable API!"

    The v0 endpoints can and will change at any time!

# Reading Challenge query/update

`host/api/v0/reading_challenges`

This endpoint allows you to query the `ReadingChallenge` documents associated with the user, or update a given `ReadingChallenge` document.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

## Querying

### Method

`GET`

### Example

`host/api/v0/reading_challenges`

### Returns

- `200` - request was successful
- `401` - if the auth token was not supplied or is invalid

## Updating

### Method

`POST`

### Body parameters (**required**)

- `name`
- `book_count`
- `start`
- `end`

### Returns

- `200` - request was successful
- `400` - if the required parameters were not supplied
- `401` - if the auth token was not supplied or is invalid

## Updating by ID

`host/api/v0/reading_challenges/[reading_challenge_id]`

### Method

`PATCH`

### Body parameters (optional)

Note: one of the optional parameters must be supplied.

- `name`
- `book_count`
- `start`
- `end`

### Returns

- `200` - request was successful
- `400` - if none of the optional parameters were supplied
- `401` - if the auth token was not supplied or is invalid
- `404` - if the specified ID does not correspond to a reading challenge entry
