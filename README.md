# chat-application
A real-time chat application.

## Technologies Used
- React and Mui for the frontend
- Firebase for authentication
- Node/Express for creating API endpoints
- PostgreSQL for storing messages
- Redis for storing sessions
- Socket.io for real-time
## Basic Features

- Users can register/login via email and password.
- Profile page where users can update their avatar and display name.
- Generate random avatars using [DiceBear API](https://avatars.dicebear.com/docs/http-api)
- Users can create a conversation to chat with active and un-active users.
- Users receive unread messages after logging back in.
- Users can see online status.
- Search functionality.
- Chatting is real-time.
- Emoji picker is also integrated.

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository.
2. Install the dependencies:
   - Navigate to the `front-end\chat` directory and run `npm install`.
   - Navigate to the `back-end\chat` directory and run `npm install`.
3. Set up Environment Variables:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project or select an existing one.
   - Store Firebase information in `.env` in `front-end `:
     
      apiKey=
     
      authDomain=
     
      projectId=
     
      storageBucket=
     
      messagingSenderId=
     
      appId=
     
      measurementId=
     
   - In the `back-end` directory, create a new file named `.env`.
   - Store PostgreSQL information in `.env`:
     
      user=
     
      host=
     
      database=
     
      password=
     
      port=

   - Update the Redis URL in the `back-end\chat\index.js` file to connect Redis.
5. Run the server:
   - Navigate to the `back-end\chat` directory and run `npm start`.
6. Run the client:
   - Navigate to the `front-end\chat` directory and run `npm start`.
7. The application will be accessible at `http://localhost:3000`.

## Function

Register account

![Screenshot 2023-10-06 at 9.46.13 PM.png](https://firebasestorage.googleapis.com/v0/b/chat-application-16c61.appspot.com/o/document%2FScreenshot%202023-10-06%20at%209.46.13%20PM.png?alt=media&token=6696d57a-d395-484e-b51e-c3571805f5d7&_gl=1*1l52c83*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5NjY0NjkwNC45LjEuMTY5NjY0NzM5NC41NC4wLjA.)


Sign in

![Screenshot 2023-10-06 at 9.58.58 PM.png](https://firebasestorage.googleapis.com/v0/b/chat-application-16c61.appspot.com/o/document%2FScreenshot%202023-10-06%20at%209.58.58%20PM.png?alt=media&token=6f14ca8c-316c-447d-9b1c-4a3f8a6cde38&_gl=1*1iqolq6*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5NjY0NjkwNC45LjEuMTY5NjY0NzYxMy42MC4wLjA.)


List of users except the main account. User "hoang" is online.

![Screenshot 2023-10-06 at 10.15.00 PM.png](https://firebasestorage.googleapis.com/v0/b/chat-application-16c61.appspot.com/o/document%2FScreenshot%202023-10-06%20at%2010.15.00%20PM.png?alt=media&token=a6d1e392-9721-409d-b83c-b1f5c0c0a059&_gl=1*dk4yku*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5NjY0NjkwNC45LjEuMTY5NjY0ODUxMS41NC4wLjA.)


Send the message to user "hoang"

![Screenshot 2023-10-06 at 10.17.18 PM.png](https://firebasestorage.googleapis.com/v0/b/chat-application-16c61.appspot.com/o/document%2FScreenshot%202023-10-06%20at%2010.17.18%20PM.png?alt=media&token=d57f498b-12a9-415d-9935-98658a870e68&_gl=1*1g5ocr*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5NjY0NjkwNC45LjEuMTY5NjY0ODcwNS41MC4wLjA.)


User "hoang" receives the messages

![Screenshot 2023-10-06 at 10.20.03 PM.png](https://firebasestorage.googleapis.com/v0/b/chat-application-16c61.appspot.com/o/document%2FScreenshot%202023-10-06%20at%2010.20.03%20PM.png?alt=media&token=d2fb971a-719f-41d3-a9fa-d23986e50f58&_gl=1*f54dgo*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5NjY0NjkwNC45LjEuMTY5NjY0ODgzOS41My4wLjA.)

![Screenshot 2023-10-06 at 10.20.19 PM.png](https://firebasestorage.googleapis.com/v0/b/chat-application-16c61.appspot.com/o/document%2FScreenshot%202023-10-06%20at%2010.20.19%20PM.png?alt=media&token=ea02ce32-d4d5-4cad-a4c9-f41014ab0678&_gl=1*16g7p38*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5NjY0NjkwNC45LjEuMTY5NjY0ODkwMC41NS4wLjA.)


User updates immediately the avatar and display name

![Screenshot 2023-10-06 at 10.25.58 PM.png](https://firebasestorage.googleapis.com/v0/b/chat-application-16c61.appspot.com/o/document%2FScreenshot%202023-10-06%20at%2010.25.58%20PM.png?alt=media&token=6a6ef82f-8279-4730-80ab-29922fde9c0a&_gl=1*bmhecm*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5NjY0NjkwNC45LjEuMTY5NjY0OTMwNy41MS4wLjA.)

![Screenshot 2023-10-06 at 10.30.52 PM.png](https://firebasestorage.googleapis.com/v0/b/chat-application-16c61.appspot.com/o/document%2FScreenshot%202023-10-06%20at%2010.30.52%20PM.png?alt=media&token=2405ff06-2804-457f-a3ab-913c796e78e2&_gl=1*ee1v2o*_ga*MTU5Mzc3MDQwMy4xNjk0NjYyMzI5*_ga_CW55HF8NVT*MTY5NjY0NjkwNC45LjEuMTY5NjY0OTQ5My4yMi4wLjA.)
