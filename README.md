# Bunzo Blog - A Full-Featured Blogging Platform

Bunzo Blog is a responsive and dynamic blogging platform built using the MERN stack, offering users an intuitive interface to explore, create, and interact with blog content. This project provides rich features such as user profiles, a dashboard for managing blogs, categories, and comments, as well as a seamless reading experience for public users. The project integrates powerful functionalities for user engagement, personalization, and security, creating a comprehensive platform for content creators and readers alike.

## 🌐 Live Demo
> [Website is Live here](https://blog-website-using-mern-vw2v.onrender.com/)  

## 🚀 Features

### 1. Public Pages
   - **Home Page**: Displays the latest blogs, featured blogs, blogs from followed users, and a newsletter subscription option.
   - **About Page**: Information about Bunzo and its mission.
   - **Category Page**: Browse blogs by various categories.
   - **Contact Page**: Allows users to get in touch with the team.
   - **Blog Detail Page**: A detailed view of individual blog posts, with options to follow/unfollow the author, like/unlike, save/unsave, and share on social media.

### 2. User Dashboard
   - **Blog Management**:
     - Create, edit, and delete blogs with cover images.
     - Manage blog post status as drafts or published.
   - **Category Management**:
     - Create and delete categories with category images.
   - **User Interaction**:
     - View and manage followers and following lists.
     - Add and reply to comments on blogs.
     - Track the latest posts.
   - **Profile Settings**:
     - Edit profile details, including profile and banner images.
     - Access various settings such as theme preference, language selection, and social media links.
     - Password updates, email verification, account deactivation, and more.

### 3. User Profile
   - **Public Profile**: Displays user details, their posted blogs, and saved blogs.
   - **Profile Edit**: Update profile details, upload profile and banner images, and manage account settings.

### 4. Authentication & Authorization
   - Register & Login functionality with email verification using OTP.
   - Password reset with a reset code.
   - Third-party login through Google and Facebook using Firebase.
   - Secure user authentication with JWT and role-based access control.

### 5. Notifications
   - Real-time notifications for interactions such as likes, follows, saves, and comments on blogs.

### 6. Social & Engagement Features
   - **Follow/Unfollow**: Follow favorite authors to get their latest blogs on the home page.
   - **Like/Unlike**: Like blogs to show appreciation.
   - **Save/Unsave**: Save blogs for easy access later.
   - **Blog Sharing**: Share blogs directly to social media platforms.

### 7. Advanced Search & Filter
   - Search bar to find specific blogs.
   - Filtering options for enhanced blog discovery.

### 8. Admin & Moderation
   - An admin can monitor and manage user content, categories, and user interactions (not implemented yet, coming soon!).

### 9. Additional Tools & Integrations
   - **Nodemailer**: For sending emails, used in OTP verification and password reset.
   - **Firebase**: For Google and Facebook third-party authentication.
   - **Social Sharing**: Blog sharing functionality across social media platforms.


## 🛠️ Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: Firebase for social login, JWT for secure authentication
- **Email**: Nodemailer for email services
- **Hosting**: Render for backend and frontend deployment

## 📖 Getting Started

To run the project locally, follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/pawantech12/blog-website-using-mern.git
    cd blog-website-using-mern
    ```

2. **Install Dependencies**:
    - For the frontend:
        ```bash
        cd client
        pnpm install
        ```
    - For the backend:
        ```bash
        cd server
        pnpm install
        ```

3. **Environment Variables**:
    -> Configure `.env` files for both frontend and backend with necessary credentials (MongoDB URI, JWT secret, Firebase config, email credentials for Nodemailer).
      -

 Add below Environment variables in your project `./client` creating file `.env`
   ```
   VITE_SERVER_URL=your_backend_server_url
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

   ```
Added below Environment variables in your project `./server` creating file `.env`

```
# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority&appName=<app-name>

# Server Configuration
PORT=3000

# Authentication Keys
JWT_SECRET_KEY=<your-jwt-secret-key>
SESSION_SECRET_KEY=<your-session-secret-key>

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

# Email SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-smtp-email>
SMTP_PASS=<your-smtp-password>

# Firebase Configuration
FIREBASE_PROJECT_ID=<your-firebase-project-id>
FIREBASE_PRIVATE_KEY_ID=<your-firebase-private-key-id>
FIREBASE_PRIVATE_KEY=<your-firebase-private-key>
FIREBASE_CLIENT_EMAIL=<your-firebase-client-email>
FIREBASE_CLIENT_ID=<your-firebase-client-id>

```

4. **Run the Project**:
    - Start the backend:
        ```bash
        pnpm run start
        ```
    - Start the frontend:
        ```bash
        pnpm run dev
        ```

5. **Open in Browser**:
    Navigate to `http://localhost:5173` to see the app in action.

## 🚀 Deployment

The project is optimized for deployment on cloud-based platforms such as Vercel for the frontend and Render for the backend. Ensure you have properly configured your environment variables for production before deployment.

## 🚧 Upcoming Features

- **Admin Dashboard** for content moderation and analytics.
- **Advanced Comment Moderation** with filters for spam and inappropriate content.
- **SEO Optimizations** for better search engine ranking.
- **Advanced Analytics** for blog performance and user insights.
- **Improved Notification System** with customizable preferences.
- **Advanced analytics** for users to see blog statistics.
- **Private messaging** feature for user interaction.

## 🔧 Project Structure

```plaintext
blog-website-using-mern/
├── client/               
│   ├── src/
│   │    ├── components/   
│   │    ├── config/   
│   │    ├── helper/   
│   │    ├── img/   
│   │    ├── pages/        
│   │    │   ├── admin/
│   │    │   │   ├── components/    
│   │    │   │   ├── pages/    
│   │    │   │   └── Dashboard.jsx    
│   │    │   └── other pages     
│   │    └── store/     
│   └── .env     
└── server/               
    ├── config/           
    ├── controllers/      
    ├── middlewares/      
    ├── models/          
    ├── routers/
    ├── utils/
    └── validations/
    └── socket.js
    └── server.js
    └── .env
```

## 🤝 Contributing

Contributions are welcome! Please fork this repository, create a feature branch, and submit a pull request with a clear description of your changes.

## Thank You for Visiting!
Thank you for checking out the Bunzo Blog Application. We're continuously working to enhance the platform with new features and improvements. If you have any suggestions or feedback, feel free to open an issue or contribute to the repository. We look forward to your contributions and hope you enjoy using Bunzo for your blogging needs!

Happy coding! 🚀
