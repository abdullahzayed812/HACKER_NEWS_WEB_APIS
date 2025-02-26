export enum ERRORS {
  TOKEN_EXPIRED = "Token expired",
  BAD_TOKEN = "Bad token",

  USER_NOT_FOUND = "User not found",
  INVALID_USER_DATA = "Invalid user data, try again.",
  INCORRECT_PASSWORD = "Incorrect password",
  USER_REQUIRED_FIELDS = "Email, username, and password are required",
  USER_ID_NOT_SENT = "You should send user id.",
  DUPLICATE_EMAIL = "An account with this email already exists",
  DUPLICATE_USERNAME = "An account with this username already exists",

  POST_ID_MISSING = "Post ID is missing",
  POST_NOT_FOUND = "Post not found",
  DUPLICATE_URL = "A post with this URL already exists",
  INVALID_POST_DATA = "A post title and url is required",

  COMMENT_MISSING = "Comment is missing",
  COMMENT_ID_MISSING = "Comment ID is missing",

  DUPLICATE_LIKE = "Duplicate like",

  SERVER_ERROR = "Server error, try again.",
}
