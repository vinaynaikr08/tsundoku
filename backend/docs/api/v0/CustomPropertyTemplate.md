??? warning "Unstable API!"

    The v0 endpoints can and will change at any time!

# Custom Property Template query/update

`host/api/v0/custom_property/template`

This endpoint allows you to query the `CustomPropertyTemplates` documents, or update a given `CustomPropertyTemplate` document.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

## Querying

### Method

`GET`

### Example

`host/api/v0/custom_property/template`

### Search query parameters (optional)

- `self` - if set to `true`, returns custom property templates associated with the current user. Defaults to `false`.

### Returns

- `200` - request was successful
- `401` - if the auth token was not supplied or is invalid

## Creating

### Method

`POST`

### Body parameters (**required**)

- `name`
- `type` enum

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `401` - if the auth token was not supplied or is invalid

## Query/Update/Delete by ID

`host/api/v0/custom_property/template/[template_id]`

### Query

#### Method

`GET`

#### Returns

- `200` - request was successful
- `401` - if the auth token was not supplied or is invalid
- `404` - if the specified ID does not correspond to a custom property template entry

### Update

#### Method

`PATCH`

#### Body parameters (optional)

Note: one of the optional parameters must be supplied.

- `name`
- `type` enum

#### Returns

- `200` - request was successful
- `400` - if none of the optional parameters were supplied
- `401` - if the auth token was not supplied or is invalid
- `404` - if the specified ID does not correspond to a custom property template entry

### Delete

#### Method

`DELETE`

#### Returns

- `200` - request was successful
- `400` - if none of the optional parameters were supplied
- `401` - if the auth token was not supplied or is invalid, or if the user does not have the necessary permissions
- `404` - if the specified ID does not correspond to a custom property template entry
