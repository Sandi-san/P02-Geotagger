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
    REACT_APP_BACKEND_DOMAIN="YOUR_BACKEND_DOMAIN"
7.	Run the application:
    ```sh
    npm run start
8.	Access the web application on URL: http://localhost:3000

## Structure:

The design of the web application is based on the following [Figma design](https://www.figma.com/design/DmN8FJw8sB664weoiYY7na/Geotagger-2023?node-id=0-1&p=f&t=q0hxFArijgD3EIVj-0).

<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/A1.jpg" width="1000px" /><br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/A2.jpg" width="1000px" />

<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/A3.jpg" width="1000px" /><br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/A4.jpg" width="1000px" />


## Design:

The frontend is split into multiple tabs depending on main functionality:
- Landing pages (home, login, register, **reset & forgotten password**)
- Profile
- Location (add, edit, guesses)
- Activity log & others

### Landing pages:

**Home (Unlogged):**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/B1.jpg" width="1000px" /><br>
The main landing page that displays as the index page, showing recently uploaded locations and options to log in. 

**Login:**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/B2.jpg" width="1000px" /><br>
The page used for an existing user to log in with their credentials.

**Register:**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/B3.jpg" width="1000px" /><br>
The page allowing the user to create a new profile on the application.

**Forgotten password (not shown in design):**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/B4.jpg" width="1000px" /><br>
The page used for sending a reset token to a user's email for resetting their password.

**Reset password (not shown in design and hidden):**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/B5.jpg" width="1000px" /><br>
The page the user can access in their reset password email, allowing them to set a new password for their account without login.


### Profile:

**Home (Logged):**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/C1.jpg" width="1000px" /><br>
The main landing page when the user is logged in, showing their best guesses and the recently created locations.

**Profile:**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/C2.jpg" width="1000px" /><br>
The user's personal profile page, showing their best guesses and uploaded locations, also allowing for editing and deleting the latter.

**Profile settings (popup form):**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/C3.jpg" width="300px" /><br>
The logged user can change their credentials; first and last name, as well as the email.

**Profile password (popup form):**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/C4.jpg" width="300px" /><br>
The logged user can change their current password.

**Profile image (popup form):**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/C5.jpg" width="300px" /><br>
The logged user can add or change their avatar image.


### Location:

**Add location:**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/D1.jpg" width="1000px" /><br>
The page for creating a new location with the specific image and position on the world map.

**Edit location:**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/D2.jpg" width="1000px" /><br>
The page for editing an existing location with the option of changing the image and address name.

**Delete location (popup):**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/D3.jpg" width="300px" /><br>
A confirmation form for when the user tries to delete any of their locations.

**Location:**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/D4.jpg" width="1000px" /><br>
The page for displaying the location, along with the image and the option to guess it's position. On the right side of the page is the leaderboard of the top guesses, with the current user's guesses highlighted in green.


### Activity log & other:

**Activity log (hidden for non-admin users):**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/E1.jpg" width="1000px" /><br>
The page allows **admin users** to view the last 100 actions of other users created on the database.

**Information changed (popup):**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/E2.jpg" width="300px" /><br>
An information popup modal that informs the user that their settings were changed successfully.

**Delete confirmation (popup):**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/E3.jpg" width="300px" /><br>
An information popup modal that informs the user that their location was deleted successfully.

**Error modal (popup):**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/E4.jpg" width="300px" /><br>
An information popup modal that displays whenever the backend API returns an error that isn't otherwise handled by the application.


## Mobile design:

Every page has a subsequent **mobile design** used for displaying on smaller resolutions. Most designs scale down the text and elements, but some change the page layout entirely. Here are some examples of the mobile variations of pages which differ from the default:

**Home (Logged):**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/F1.jpg" width="300px" />

**Activity log:**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/F2.jpg" width="300px" />

**Header menu:**<br>
<img alt="image" src="https://github.com/Sandi-san/P02-Geotagger/raw/frontend/public/readme_images/F3.jpg" width="300px" />
