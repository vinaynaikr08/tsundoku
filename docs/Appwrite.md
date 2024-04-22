# Appwrite

This document outlines the database structure for Appwrite, for future users/administrators of this project stack.

There is a single database, `Main`, where all collections reside.

## Collections

### `Authors`

#### Attributes

- `name`
  - Type: String
  - Required
  - Max: 50
- `books`
  - Two-way relationship with `Books` collection
  - Attribute key: `books`
  - Attribute key (related collection): `authors`
  - Relation: Many to many
  - On delete: Set NULL

#### Indexes

- Key `name`
  - Type: Fulltext
  - Attributes: `name`
  - Asc

### `Books`

#### Attributes

- `title`
  - Type: String
  - Required
  - Max: 100
- `authors`
  - Two-way relationship with `Authors` collection
  - Attribute key: `authors`
  - Attribute key (related collection): `books`
  - Relation: Many to many
  - On delete: Set NULL
- `editions`
  - Two-way relationship with `Editions` collection
  - Attribute key: `editions`
  - Attribute key (related collection): `books`
  - Relation: One to many
  - On delete: Cascade
- `google_books_id`
  - Type: String
  - Max: 15
- `description`
  - Type: String
  - Max: 5000
- `genre`
  - Type: String
  - Max: 100

#### Indexes

- Key `title`
  - Type: Fulltext
  - Attributes: `title`
  - Asc

### `BookStatuses`

#### Attributes

- `status`
  - Type: Enum
  - Required
  - Elements:
    - `CURRENTLY_READING`
    - `WANT_TO_READ`
    - `DID_NOT_FINISH`
    - `READ`
- `user_id`
  - Type: String
  - Required
  - Max: 20
- `book`
  - One-way relationship with `Books` collection
  - Attribute key: `book`
  - Relation: Many to one
  - On deletion: Restrict

### `CustomPropertyCategories`

#### Attributes

- `template_id`
  - Type: String
  - Required
  - Max: 20
- `values`
  - Type: String []
  - Max: 200

### `CustomPropertyData`

#### Attributes

- `book_id`
  - Type: String
  - Required
  - Max: 20
- `user_id`
  - Type: String
  - Required
  - Max: 20
- `template_id`
  - Type: String
  - Required
  - Max: 20
- `value`
  - Type: String
  - Required
  - Max: 100

### `CustomPropertyTemplates`

#### Attributes

- `name`
  - Type: String
  - Required
  - Max: 50
- `type`
  - Type: Enum
  - Required
  - Elements:
    - `BOOLEAN`
    - `CATEGORICAL`
    - `NUMERICAL`
- `user_id`
  - Type: String
  - Required
  - Max: 20

### `Editions`

#### Attributes

- `page_count`
  - Type: Integer
  - Min: 0
  - Max: 999999
- `publish_date`
  - Type: Datetime
  - Default: NULL
- `publisher`
  - Type: String
  - Max: 100
  - Default: NULL
- `isbn_13`
  - Type: String
  - Required
  - Max: 13
- `isbn_10`
  - Type: String
  - Required
  - Max: 10
- `format`
  - Type: Enum
  - Elements:
    - `Hardcover`
    - `Paperback`
    - `Kindle`
    - `Ebook`
    - `Audiobook`
  - Default: NULL
- `books`
  - Two-way relationship with `Books`
  - Attribute key: `books`
  - Attribute key (related collection): `editions`
  - Relation: One to many
  - On delete: Cascade
- `thumbnail_url`
  - Type: Url
  - Default: NULL

#### Indexes

- Key `isbn_13`
  - Type: Fulltext
  - Attributes: `isbn_13`
  - Asc
- Key `isbn_10`
  - Type: Fulltext
  - Attributes: `isbn_10`
  - Asc

### `Friends`

#### Attributes

- `requester`
  - Type: String
  - Required
  - Max: 20
- `requestee`
  - Type: String
  - Required
  - Max: 20
- `status`
  - Type: Enum
  - Required
  - Elements:
    - `PENDING`
    - `ACCEPTED`
- `requester_notifs`
  - Type: Boolean
  - Default: True
- `requestee_notifs`
  - Type: Boolean
  - Default: True

### `NotificationPreferences`

#### Attributes

- `user_id`
  - Type: String
  - Max: 20
  - Required
- `general`
  - Type: Boolean
  - Required
- `new_follower`
  - Type: Boolean
  - Required
- `friend_reading_status_update`
  - Type: Boolean
  - Required

### `Notifications`

#### Attributes

- `user_id`
  - Type: String
  - Max: 20
  - Required
- `type`
  - Type: Enum
  - Required
  - Elements:
    - `friends_req`
    - `status_update`
- `title`
  - Type: String
  - Max: 200
  - Required
- `description`
  - Type: String
  - Max: 500
  - Required

### `PastWrappeds`

#### Attributes

- `user_id`
  - Type: String
  - Max: 20
  - Required
- `year`
  - Type: Integer
  - Min: 0
  - Max: 9999
  - Required
- `pages_read`
  - Type: Integer
  - Min: -9223372036854776000
  - Max: 9223372036854776000
  - Required
- `genre_one`
  - Type: Integer
  - Min: 0
  - Max: 52
  - Required
- `genre_two`
  - Type: Integer
  - Min: 0
  - Max: 52
  - Required
- `genre_three`
  - Type: Integer
  - Min: 0
  - Max: 52
  - Required
- `genre_four`
  - Type: Integer
  - Min: 0
  - Max: 52
  - Required
- `genre_five`
  - Type: Integer
  - Min: 0
  - Max: 52
  - Required
- `genre_one_count`
  - Type: Integer
  - Min: -9223372036854776000
  - Max: 9223372036854776000
  - Required
- `genre_two_count`
  - Type: Integer
  - Min: -9223372036854776000
  - Max: 9223372036854776000
  - Required
- `genre_three_count`
  - Type: Integer
  - Min: -9223372036854776000
  - Max: 9223372036854776000
  - Required
- `genre_four_count`
  - Type: Integer
  - Min: 0
  - Max: 9223372036854776000
  - Required
- `genre_five_count`
  - Type: Integer
  - Min: 0
  - Max: 9223372036854776000
  - Required
- `genre_other_count`
  - Type: Integer
  - Min: 0
  - Max: 9223372036854776000
  - Required

### `PrivateNotes`

#### Attributes

- `user_id`
  - Type: String
  - Max: 20
  - Required
- `book_id`
  - Type: String
  - Max: 20
  - Required
- `notes`
  - Type: String
  - Max: 2000
  - Default: NULL

### `ReadingChallenges`

#### Attributes

- `user_id`
  - Type: String
  - Max: 20
  - Required
- `name`
  - Type: String
  - Max: 30
  - Required
- `book_count`
  - Type: Integer
  - Min: 1
  - Max: 5000
  - Required
- `start`
  - Type: Datetime
  - Required
- `end`
  - Type: Datetime
  - Required

### `Reviews`

#### Attributes

- `user_id`
  - Type: String
  - Max: 20
  - Required
- `book`
  - One-way relationship with `Books` collection
  - Attribute key: `book`
  - Relation: Many to one
  - On deletion: Restrict
- `star_rating`
  - Type: Integer
  - Min: 0
  - Max: 20
  - Required
- `description`
  - Type: String
  - Max: 5000
  - Default: NULL

### `ReviewVotes`

#### Attributes

- `review_id`
  - Type: String
  - Max: 20
  - Required
- `user_id`
  - Type: String
  - Max: 20
  - Required
- `vote`
  - Type: Enum
  - Elements:
    - `UPVOTE`
    - `DOWNVOTE`
  - Required

### `UserData`

#### Attributes

- `user_id`
  - Type: String
  - Max: 20
  - Required
- `username`
  - Type: String
  - Max: 20
  - Required
- `about_me_bio`
  - Type: String
  - Max: 2000
  - Default: NULL
- `social_url`
  - Type: Url
  - Default: NULL

#### Indexes

- Key `username`
  - Type: Unique
  - Attributes: `username`
  - Asc
