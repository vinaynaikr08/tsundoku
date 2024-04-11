??? warning "Unstable API!"

    The v0 endpoints can and will change at any time!

# Review query/update

`host/api/v0/reviews`

This endpoint allows you to query the `Review` documents associated with the user, or update a given `Review` document.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

## Querying

### Method

`GET`

### Example

`host/api/v0/reviews`

### Returns

- `200` - request was successful
- `401` - if the auth token was not supplied or is invalid

## Updating

### Method

`POST`

### Body parameters (**required**)

- `book_id`
- `star_rating` integer

### Body parameters (optional)

- `description` string

### Returns

- `200` - request was successful
- `400` - if the required parameters are not supplied
- `401` - if the auth token was not supplied or is invalid

## Updating by ID

`host/api/v0/reviews/[review_id]`

### Method

`PATCH`

### Body parameters (optional)

Note: one of the optional parameters must be supplied.

- `star_rating` integer
- `description` string

### Returns

- `200` - request was successful
- `400` - if none of the optional parameters were supplied
- `401` - if the auth token was not supplied or is invalid
- `404` - if the specified ID does not correspond to a book review entry

## Get votes of review by ID

`host/api/v0/reviews/[review_id]/vote`

This endpoint returns the aggregated vote count, as well as the vote status of the current user. You may also modify the vote of the current user.

All requests to this endpoint require the JWT token to be supplied in the `Authorization` header, in the `Bearer <token>` format.

### Method

`GET`

### Returns

- `200` - request was successful
- `400` - if the specified review ID does not correspond to a book review entry
- `401` - if the auth token was not supplied or is invalid
- `404` - if the user did not cast a vote for the specified review ID

## Cast vote for review by ID

### Method

`POST`

### Body parameters (**required**)

- `vote` enum - either `UPVOTE` or `DOWNVOTE`

### Returns

- `200` - request was successful
- `400` - if the specified review ID does not correspond to a book review entry
- `401` - if the auth token was not supplied or is invalid, or if the required parameter is not supplied
- `404` - if the user did not cast a vote for the specified review ID

## Rescind vote for review by ID

### Method

`DELETE`

### Returns

- `200` - request was successful
- `400` - if the specified review ID does not correspond to a book review entry
- `401` - if the auth token was not supplied or is invalid
- `404` - if the user did not cast a vote for the specified review ID
