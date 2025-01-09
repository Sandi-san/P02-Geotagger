export enum apiRoutes {
  //auth
  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
  FORGOTTEN_PASSWORD = '/auth/forgotten-password',
  RESET_PASSWORD = '/auth/reset-password',
  OAUTH = '/auth/google',
  // SIGNOUT = '/auth/signout',

  //user
  FETCH_USER = '/user',
  UPDATE_USER = '/user/update',
  UPDATE_USER_PASSWORD = '/user/update-password',
  UPDATE_USER_IMAGE = '/user/upload-image',

  USER_LOCATIONS = '/user/locations',
  USER_GUESSES = '/user/guesses',
  USER_ACTIONS = '/user/actions',

  //locations
  LOCATION_PREFIX = '/locations',
  UPLOAD_IMAGE_SUFFIX = '/update-image',
  FETCH_GUESSES = 'guesses',
  GUESS_LOCATION = 'guess',
}
