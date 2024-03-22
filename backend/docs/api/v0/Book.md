??? warning "Unstable API!"

    The v0 endpoints can and will change at any time!

# Book

## Search

`host/api/v0/books/search`

### Method

`GET`

### Search query parameters (**required**)

`title`

### Search query parameters (optional)

`simulateAPIFailure` - `true` or `false`

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `503` - if API failure is simulated (or if the API is actually down)

### Example

`host/api/v0/books/search?title=turtle+in+paradise`
