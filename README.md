<h1 align="center">MandelbrotCMS Frontend</h1>

[Live Production](https://cms.saifchan.online/)

<hr>

## About the Project 
The Frontend of MandelbrotCMS project, the project is built using React.js and Typescript 
with scalability, reliability, and application size in mind.

It uses React's lazy loading to dynamically load components at runtime, 
combined with build-time JavaScript and CSS code splitting via Vite, 
ensuring the web app loads quickly and remains lightweight.

### Code Organization
Seperated code into:
* Components Folder: The folder which uses reusable components
* Pages Folder: The pages that don't belong to any part
* Parts Folder: Contains parts folders, and each contains its related code similar organization
* Other folders and files

## How to Run Locally
### Prerequisits
Having nodejs, npm and vitejs installed on your machine

### Installation and Configuration

#### Installation
To installed required dependencies, run this command in project's root folder:
```
npm install
```

#### Configuration
To make frontend able to communicate with the backend, you need to create .env file that contains the following:
```
VITE_API_BASE_URL="backend server url with backslash at the end (e.g http://localhost:10000/)"
VITE_GOOGLE_CLIENT="Google client id for social auth"
VITE_GITHUB_AUTHORIZE=https://github.com/login/oauth/authorize?client_id=<GITHUB CLIENT ID>&amp;redirect_uri=<APP LINK>&amp;scope=user
```

Create `.env.development` for keys for dev server and `.env.production` for production server

### Running the app
Run one of the following commands to run the app on dev server:
```
npm run dev
OR
vite dev
```
Run one of the following commands to build for production:
```
npm run build
OR
vite build --mode <"production" or "development">
```
Run one of the following commands to preview the build:
```
npm run preview
OR
vite preview
```

## Contribution
Feel free to fork the repository and creating pull requests

<hr>
This was the repository for the Frontend of MandelbrotCMS.

[The repo for the Backend](https://github.com/SA12IF34/MandelbrotCMS-Backend)
