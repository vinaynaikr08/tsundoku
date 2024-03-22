# Friends query/create/update

`host/api/v0/friends`

This endpoint allows you to query the `Friends` documents associated with the user, or create a `Friends` request.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

## Querying

### Method

`GET`

### Example

`host/api/v0/friends`

### Returns

- `200` - request was successful
- `401` - if the auth token was not supplied or is invalid

## Creating

### Method

`POST`

### Body parameters (**required**)

- `requestee_id`

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied, or is invalid
- `401` - if the auth token was not supplied or is invalid

## Updating by ID

`host/api/v0/friends/[friends_id]`

### Method

`PATCH`

### Body parameters (**required**)

- `status` enum (`ACCEPTED` only)

### Returns

- `200` - request was successful
- `400` - if the status enum was not supplied or was not `ACCEPTED`
- `401` - if the auth token was not supplied or is invalid, or if you do not have permissions to reject this friend relation
- `404` - if the specified ID does not correspond to a friend relations entry

### Method

`DELETE`

### Returns

- `200` - request was successful
- `401` - if the auth token was not supplied or is invalid, or if you do not have permissions to reject this friend relation
- `404` - if the specified ID does not correspond to a friend relations entry
