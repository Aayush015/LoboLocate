# LoboLocate - Lost and Found Application

Welcome to **LoboLocate**, a mobile app designed to help users report, find, and match lost and found items. This app is built with **React Native** for the frontend, with a **Node.js/Express** backend hosted on Heroku, and uses **MongoDB** for data storage. LoboLocate connects users to potential matches, facilitates real-time chats, and allows item reporting through the Google Vision API for image processing.

## Video Demonstration

[![Watch the video](https://img.youtube.com/vi/zAapFw2X3GY/1.jpg)](https://youtu.be/zAapFw2X3GY)

Click the image above or [here](https://youtu.be/zAapFw2X3GY) to watch the video demonstration on YouTube.


---

## Architecture Diagram

![LoboLocate Architecture Diagram](./Architecture%20Diagram.png)

---

## Table of Contents

1. [Features](#features)
2. [Screens and Components](#screens-and-components)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
5. [Backend API Routes](#backend-api-routes)
6. [Environment Variables](#environment-variables)
7. [Usage](#usage)
8. [Troubleshooting](#troubleshooting)

---

## Features

- **User Authentication**: Login and signup functionality.
- **Report Lost or Found Items**: Users can upload images, describe items, and report lost or found items.
- **Image Recognition**: Google Vision API integration to assist with item descriptions.
- **Matchmaking**: AI-based matching of lost items with found items.
- **Chat System**: Real-time chat between users for item retrieval.
- **User History**: Log of reported and matched items.
- **Unclaimed Items Display**: Display of unclaimed items open for retrieval.

---

## Screens and Components

### Screens
- **Welcome**: Displays welcome message, menu, and quick action buttons for item reporting.
- **ReportFoundItem / ReportLostItem**: Forms for reporting lost or found items, including image upload and description generation.
- **PotentialMatches**: Displays potential matches for reported lost items.
- **UserHistory**: Displays user's reporting history.
- **UnclaimedItems**: Lists unclaimed items with relevant information.
- **Login**: User login screen.
- **Signup**: User signup screen.

### Key Components
- **RootStack**: Manages stack navigation for screens.
- **Google Vision API**: Used for generating descriptions from uploaded images.

---

## Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB (Atlas)
- **APIs**: Google Vision API for image analysis
- **Hosting**: Heroku (Backend)

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) and npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/) for React Native
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```
2. Install dependencies: 
    ```bash
    npm install
    ```
3. Start the app: 
    ```
    npm start
    ```

### Backend Setup
1. Navigate to the backend directory: 
    ```
    cd login_server
    ```
2. Install dependencies: 
    ```
    npm install
    ```
3. Create a .env file in the backend directory and add the following variables: 
    ```
    MONGODB_URI=<Your MongoDB URL>
    ```
4. Start the server:
    ```
    npm start
    ```

## Backend API Routes

### User Routes (`api/User.js`)
- `POST /user/signup` - Register a new user.
- `POST /user/login` - Authenticate an existing user.

### Item Routes (`api/Item.js`)
- `POST /item/report` - Report a lost or found item.
- `GET /item/potentialMatches/:userId` - Retrieve potential matches for a lost item.
- `GET /item/history/:userId` - Get the history of all items reported by a user.
- `DELETE /item/delete/:itemId` - Delete a specific reported item.
- `GET /item/chat/:itemId` - Fetch chat history related to an item.

### Chat Routes (`api/Chat.js`)
- **Socket.IO Events**: Real-time message exchange between users.

---

## Environment Variables

Ensure the following environment variables are set for both development and production:

| Variable         | Description                     |
|------------------|---------------------------------|
| `MONGO_URI`      | MongoDB connection string       |
| `GOOGLE_API_KEY` | Google Vision API Key           |
| `PORT`           | Port on which the server runs   |

---

## Usage

1. **Sign Up/Login**: Users sign up or log in to access the app.
2. **Report an Item**: Navigate to the "Report Found" or "Report Lost" screen, upload an image, and fill out details.
3. **Check for Matches**: Go to the "Potential Matches" screen to view possible matches based on reported items.
4. **Chat with Finder**: If a potential match is found, users can chat with the item’s finder to retrieve the item.
5. **View Unclaimed Items**: Check the "Unclaimed Items" screen for items unclaimed for over 90 days.
6. **View History**: Access the "User History" screen for an overview of all reported items.