import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBGbuLc7nUfFh9cJw-1AvrWts42zufJXug",
  authDomain: "bunzo-blog-website.firebaseapp.com",
  projectId: "bunzo-blog-website",
  storageBucket: "bunzo-blog-website.appspot.com",
  messagingSenderId: "795400181397",
  appId: "1:795400181397:web:5026726426ad916da36d9c",
  measurementId: "G-NC0D3J8C9C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
