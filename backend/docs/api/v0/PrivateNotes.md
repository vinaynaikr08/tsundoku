??? warning "Unstable API!"

    The v0 endpoints can and will change at any time!

# Private notes query/update

`host/api/v0/private_notes`

This endpoint allows you to query the `PrivateNote` documents associated with the user, or update a given `PrivateNote` document.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

## Querying

### Method

`GET`

### Search parameters (optional)

- `book_id`

### Example

`host/api/v0/private_notes`

### Returns

- `200` - request was successful
- `401` - if the auth token was not supplied or is invalid

## Updating

### Method

`POST`

### Body parameters (**required**)

- `book_id`
- `notes`

### Returns

- `200` - request was successful
- `400` - if the required parameters were not supplied
- `401` - if the auth token was not supplied or is invalid

## Updating by ID

`host/api/v0/private_notes/[private_notes_id]`

### Method

`PATCH`

### Body parameters (**required**)

- `notes`

### Returns

- `200` - request was successful
- `400` - if the required parameters were not supplied
- `401` - if the auth token was not supplied or is invalid
- `404` - if the specified ID does not correspond to a private note entry
