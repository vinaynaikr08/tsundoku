??? warning "Unstable API!"

    The v0 endpoints can and will change at any time!

# Book Status query/update

`host/api/v0/bookstatus`

This endpoint allows you to query the `BookStatus` documents associated with the user, or update a given `BookStatus` document.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

## Querying

### Method

`GET`

### Example

`host/api/v0/bookstatus`

### Returns

- `200` - request was successful
- `401` - if the auth token was not supplied or is invalid

## Updating

### Method

`POST`

### Body parameters (**required**)

- `book_id`
- `status` enum

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `401` - if the auth token was not supplied or is invalid

## Updating by ID

`host/api/v0/bookstatus/[bookstatus_id]`

### Method

`PATCH`

### Body parameters (required)

`status` enum

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `401` - if the auth token was not supplied or is invalid
- `404` - if the specified ID does not correspond to a book status entry
