??? warning "Unstable API!"

    The v0 endpoints can and will change at any time!

# Author

## Search

`host/api/v0/author/search`

### Method

`GET`

### Search query parameters (**required**)

`name`

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied

### Example

`host/api/v0/author/search?name=john+green`
