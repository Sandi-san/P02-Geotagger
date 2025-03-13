# GEOTAGGER

<img alt="image" src="https://brotherants.com/skillupmentor/images/02-project-header.png" width="600px" /> 

## Description:

Geotagger is a dynamic full-stack application that allows users to upload an image and mark the exact location on a world map where the image was taken.
Registered users then try to guess where the image was taken by placing a pin on the map. The app then returns how accurate the chosen location was to the original (error distance).
Users can compete against one another by how close they guess to a certain location.

Users can play the guess game only if they have game points. A registered user starts with 10 points, and gains 10 points for every new location they upload. User loses guess points by guessing on a location:
- First guess on specific location: 1 point
- Second guess on specific location: 2 points 
- Third and every subsequent guess on specific location: 3 points


## Technologies used:
<img alt="image" src="https://brotherants.com/skillupmentor/images/image3.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image19.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image1.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/jest-icon.jpeg" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image8.png" width="30px" /> <img alt="image" src="https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/001/287/square_480/prismaHD.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image14.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/swagger.png" width="30px" /> <img alt="image" src="https://raw.githubusercontent.com/nodemailer/nodemailer/master/assets/nm_logo_200x136.png" width="30px" /> <img alt="image" src="https://miro.medium.com/v2/resize:fit:450/1*vSuf2h3TCpcUuTwsMzsI_w.png" width="30px" />

**Backend:**
- NodeJS (main environment)
- NestJS (main application structure)
- Express (main framework)
- Jest (test module)
- PostgreSQL (database manager)
- Prisma (database connection)
- JWT (token authentication)
- Swagger (API documentation)
- Nodemailer (email service)
- Google OAuth2 (login with google)

<img alt="image" src="https://brotherants.com/skillupmentor/images/image5.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image7.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/mui-icon.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image11.png" width="30px" /> <img alt="image" src="https://miro.medium.com/v2/resize:fit:1200/1*AJpFZrofvxMn3MHh9p3i_Q.jpeg" width="30px" /> <img alt="image" src="https://images.velog.io/images/jungsangu/post/7b8d2e90-49f0-45cd-8701-34bed5d1f4a6/logo_waifu2x_art_scale_tta_1.png" width="30px" />

**Frontend:**
- HTML (browser display)
- CSS (browser styling)
- MUI (CSS styling)
- React (main application structure)
- Redux Toolkit (state management)
- RTK Query (data manipulation)

<img alt="image" src="https://brotherants.com/skillupmentor/images/image17.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image4.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image12.png" width="25px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image18.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image16.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/aws-s3-icon.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image2.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image10.png" width="30px" /> <img alt="image" src="https://brotherants.com/skillupmentor/images/image13.png" width="30px" />

**Other:**
- JS (programming)
- TS (typed JS)
- Figma (frontend design)
- Docker (packaging)
- AWS (remote deployment)
- AWS S3 (remote file saving)
- Git, GitHub (versioning)
- Trello (task management)
- JSON (API data structure)


## Installation:

1. Open command prompt in directory where you want to run the project.
2. Download Node Package Manager (NPM): [Node.js](https://nodejs.org/)
3. Clone this repo:
   ```sh
   git clone https://github.com/Sandi-san/P02-Geotagger.git
4. Navigate to project directory (example):
    ```sh
   cd P02-Geotagger
5.	Install project dependencies:
    ```sh
    npm install
6.	Configure project:
  - Create database
  - Create credentials in `.env` file
    ```sh
    DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/DB_NAME?schema=public"
    JWT_SECRET="YOUR_JWT_TOKEN"
7.	Run the application:
    ```sh
    npm run
8.	Access the API documentation on URL: http://localhost:8080/


## Endpoints

The backend portion of the project consists of API endpoint routes that the frontend portion of the application calls to receive or change data in the database.

The endpoints expect and return requests in JSON format. They consist of three main classes: User, Location, and Guess. User is split into two classes: User and Auth.

All available endpoint routes are noted below. The **bolded endpoints** require authentication to be accessed: `Authorization: Bearer "TOKEN_VALUE"`. Bolded arguments are **required**.

### Auth class:

- POST /auth/login

    Login as a user (**email, password**).

- POST /auth/register

    Register with a new user profile (first name, last name, **email, password**).

- POST /auth/forgotten-password

    Sends a reset password token to a certain email address (**email**).

- POST /auth/reset-password

    Reset the user's password (**reset_token, password, confirm password**). The reset token is uniquely tied to the account of the change. 

- GET /auth/google

    Redirects the user to the Google OAuth login page.

- GET /auth/google/redirect

    Retrieves Google OAuth data. Used to login or register a user with OAuth data.


### User class:

- **GET /user**
    
    Returns the user data of the currently logged user.
    
- **PATCH /user/update**
    
    Updates user's basic data (firstName, lastName, email).

- **PATCH /user/update-password**
    
    Updates user's password only (**password, confirm_password, new_password**).

- **POST /user/update-image**
    
    Uploads image file and updates user's image entity (**image**).

- **GET /user/locations**
    
    Returns paginated locations made by user (page, take). Recieves the page number and number of elements to fetch.

- **GET /user/guesses**
    
    Returns paginated guesses made by user (page, take). 

- **POST /user/actions**
    
    Posts an array of actions made by user (**actions**: {action, type, newValue, url, timestamp}).

- **GET /user/actions**
    
    Returns the last 100 actions saved within the database.


### Location class:

- GET /location
    
    Returns paginated locations made by all users (page, take). Recieves the page number and number of elements to fetch.
    
- **POST /location**
    
    Creates new location (image, **lat, lon**, address).
    
- GET /location/{id}
    
    Returns a certain location with a specific id.
    
- **PATCH /location/{id}**
    
    Updates a certain location with a specific id (image, lat, lon, address).
    
- **DELETE /location/{id}**
    
    Deletes a certain location with a specific id.

- **POST /location/{id}/update-image**
    
    Uploads image file and updates a certain location's image entity (**image**).
    
- **POST /location/{id}/guess**
    
    Creates a new guess for a certain location with a specific id (**lat, lon**).
    
- **GET /location/{id}/guesses**
    
    Returns all guesses from a certain location with a specific id.
    

## Database scheme:

To access the database, use the `npx prisma studio` command.

The database scheme can be found in the following path: `prisma/schema.prisma`

To generate database tables from the scheme, use the `npx prisma migrate dev` command.


## Mail service:

This application uses **Nodemailer** as a mail service for sending reset tokens to emails for resetting passwords.

To enable this functionality, add the following variables to your `.env` file:
```sh
EMAIL_USER="YOUR_HOST_EMAIL"
EMAIL_PASS="YOUR_GENERATED_PASSWORD"
```
You can create `YOUR_GENERATED_PASSWORD` by following the next steps:

1. Go to your **Google account** settings.
2. Go to **Security**.
3. Enable **2-Step Verification**.
4. Go to **app passwords** section in your Google account and **create a new app instance**.
5. **Generate the application password** and save it into your `.env` file.


## Google OAuth:

This application supports registration and login using **Google OAuth**.

To enable this functionality, add the following variables to your `.env` file:
```sh
GOOGLE_CLIENT_ID="YOUR_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_CLIENT_SECRET"
```
You can create `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` by following the next steps:

1. Go to your **Google Cloud console**.
2. Create a new **project**.
3. In the console, select the **APIs and Services** tab and go to **Credentials**.
4. Create a new **credential**.
5. Fill the necessary requirements and add the following route to the **Authorized redirect URIs** section: `http://localhost:8080/auth/google/redirect`
6. Go back to the **Credentials** page and look under your newly created credential to get the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` variables and save them to your `.env` file.