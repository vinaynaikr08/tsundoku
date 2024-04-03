# User

`host/api/v0/users/`

## Account deletion

This endpoint allows you to delete the account of the current user.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

#### Method

`DELETE`

#### Returns

- `200` - request was successful
- `401` - if the auth token was not supplied or is invalid

## Username

### Query

`host/api/v0/users/username`

This endpoint allows you to query the username of the current user.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

#### Method

`GET`

#### Returns

- `200` - request was successful
- `401` - if the auth token was not supplied or is invalid

### Update

#### Method

`PATCH`

#### Body parameters (**required**)

- `username`

#### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied or are invalid
- `401` - if the auth token was not supplied or is invalid


## About me biography

### Query

`host/api/v0/users/about_me_bio`

This endpoint allows you to query the about me biography of the current user.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

#### Method

`GET`

#### Returns

- `200` - request was successful
- `401` - if the auth token was not supplied or is invalid

### Update

#### Method

`PATCH`

#### Body parameters (**required**)

- `about_me_bio`

#### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied or are invalid
- `401` - if the auth token was not supplied or is invalid


## Name query

`host/api/v0/users/[user_id]/name`

This endpoint allows you to query the name of the user with the given ID.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

### Method

`GET`

### Returns

- `200` - request was successful
- `401` - if the auth token was not supplied or is invalid
- `404` - if the specified ID does not correspond to a user
