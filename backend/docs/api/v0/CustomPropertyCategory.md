??? warning "Unstable API!"

    The v0 endpoints can and will change at any time!

# Custom Property Category query/update

`host/api/v0/custom_property/category`

This endpoint allows you to query the `CustomPropertyCategories` documents, or update a given `CustomPropertyCategory` document.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

## Querying

### Method

`GET`

### Example

`host/api/v0/custom_property/category`

### Search query parameters (**required**)

`template_id`

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `401` - if the auth token was not supplied or is invalid

## Creating

### Method

`POST`

### Body parameters (**required**)

- `template_id`
- `values`

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `401` - if the auth token was not supplied or is invalid

## Updating by ID

`host/api/v0/custom_property/category/[category_id]`

#### Method

`PATCH`

#### Body parameters (**required**)

- `values`

#### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `401` - if the auth token was not supplied or is invalid
- `404` - if the specified ID does not correspond to a custom property template entry
