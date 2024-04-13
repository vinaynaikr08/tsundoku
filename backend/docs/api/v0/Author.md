??? warning "Unstable API!"

    The v0 endpoints can and will change at any time!

# Author

## Search

`host/api/v0/authors/search`

### Method

`GET`

### Search query parameters (**required**)

`name`

### Search query parameters (**optional**)

`exact` - when set to `true`, will disable fuzzy-searching. Defaults to `false`

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied

### Example

`host/api/v0/authors/search?name=john+green`

## Create

`host/api/v0/authors`

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

### Method

`POST`

### Body parameters (**required**)

`name`

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `401` - if the auth token was not supplied or is invalid
