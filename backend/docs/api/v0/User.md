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

To query usernames of other users, supply a user ID in the search parameter `user_id`.

#### Method

`GET`

#### Search parameters (optional)

- `user_id`

#### Returns

- `200` - request was successful
- `400` - if neither the auth token nor the user ID was provided
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

To query about me bios of other users, supply a user ID in the search parameter `user_id`.

#### Method

`GET`

#### Search parameters (optional)

- `user_id`

#### Returns

- `200` - request was successful
- `400` - if neither the auth token nor the user ID was provided
- `401` - if the auth token was not supplied or is invalid

### Update

Warning: you will not be able to set the about me bio if the `UserData` object does not exist. This means the user account must have a `username` set in order to proceed.

#### Method

`PATCH`

#### Body parameters (**required**)

- `about_me_bio`

#### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied or are invalid
- `401` - if the auth token was not supplied or is invalid
- `404` - the associated `UserData` entry was not found

## Social URL

### Query

`host/api/v0/users/social_url`

This endpoint allows you to query the social URL of the current user.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

To query social URLs of other users, supply a user ID in the search parameter `user_id`.

#### Method

`GET`

#### Search parameters (optional)

- `user_id`

#### Returns

- `200` - request was successful
- `400` - if neither the auth token nor the user ID was provided
- `401` - if the auth token was not supplied or is invalid

### Update

Warning: you will not be able to set the social URL if the `UserData` object does not exist. This means the user account must have a `username` set in order to proceed.

#### Method

`PATCH`

#### Body parameters (**required**)

- `social_url`

#### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied or are invalid
- `401` - if the auth token was not supplied or is invalid
- `404` - the associated `UserData` entry was not found

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
