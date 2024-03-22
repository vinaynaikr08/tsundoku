??? warning "Unstable API!"

    The v0 endpoints can and will change at any time!

# Custom Property Data query/update

`host/api/v0/custom_property/data`

This endpoint allows you to query the `CustomPropertyData` documents, or update a given `CustomPropertyData` document.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

## Querying

### Method

`GET`

### Search query parameters (optional)

- `book_id` - if supplied, returns custom property data associated with the specific book

### Example

`host/api/v0/custom_property/data`

### Returns

- `200` - request was successful
- `401` - if the auth token was not supplied or is invalid

## Creating

### Method

`POST`

### Body parameters (**required**)

- `book_id`
- `template_id`
- `value`

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `401` - if the auth token was not supplied or is invalid

## Updating by ID

`host/api/v0/custom_property/data/[data_id]`

#### Method

`PATCH`

#### Body parameters (**required**)

- `value`

#### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `401` - if the auth token was not supplied or is invalid
- `404` - if the specified ID does not correspond to a custom property data entry
