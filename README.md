# R Blogs - Read Emotions 🌟

Welcome to **R Blogs - Read Emotions**, a powerful, full-stack blogging platform built using the MERN stack (MongoDB, Express, React, Node.js), designed to allow users to express their thoughts and emotions through blog posts. With the integration of AWS S3 for seamless image storage and deployments on Render and Vercel, this platform provides a sleek and responsive user experience.

## 🚀 Features

- **User Authentication**: Secure login and registration system for users to manage their blog posts.
- **Post Creation & Editing**: Create, edit, and delete blog posts with rich text formatting.
- **Image Upload**: Use AWS S3 to store and serve images with ease.
- **Dark Mode**: Toggle between light and dark modes for a personalized experience.
- **Responsive Design**: Optimized layout for all devices, ensuring a smooth experience on mobile, tablet, and desktop.

## 🔧 Tech Stack

The project leverages a modern full-stack architecture:

- **Frontend**: React, JSX, CSS, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (NoSQL Database)
- **Authentication**: JSON Web Tokens (JWT), Secure Password Storage (bcrypt)
- **Image Storage**: AWS S3 Bucket for storing images
- **Deployment**:
  - **Frontend**: Deployed on [Vercel](https://vercel.com)
  - **Backend**: Hosted on [Render](https://render.com)

## 📦 Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/your-username/r-blogs.git
```

2. **Set up the Backend**
  Navigate to the backend folder:
  ```bash
  cd backend
```
Install dependencies:
```
npm install
```
Create a .env file and configure it with the following:
```MONGO_URI=<your-mongo-db-connection-string>
  JWT_SECRET=<your-jwt-secret>
  PORT=5000
your aws s3 bucket info
```
Start the backend server:
```
node index.js
```
3. Set up the Frontend
Navigate to the frontend folder:
cd ../frontend
Install dependencies:
```
npm install
```
Create a .env file and configure it with the following:
```
REACT_APP_API_BASE=http://localhost:5000/api
```
Start the frontend development server:
```
npm start
```
``
## 🤝 Open for Contributions

Contributions are welcome! If you'd like to contribute, feel free to fork the repository, make improvements, and submit a pull request.  
Let's collaborate and make this project even better!

