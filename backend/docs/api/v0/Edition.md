??? warning "Unstable API!"

    The v0 endpoints can and will change at any time!

# Edition

## Create

`host/api/v0/editions`

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

### Method

`POST`

### Body parameters (**required**)

- `isbn_10`
- `1sbn_13`

### Body parameters (optional)

- `page_count`
- `publish_date`
- `publisher`
- `format`
- `thumbnail_url`

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `401` - if the auth token was not supplied or is invalid
