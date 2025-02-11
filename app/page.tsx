"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase Auth
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import { auth } from "./firebase/config"; // Import auth from firebase/config
import Link from "next/link";
import { FirebaseError } from "firebase/app";

export default function Home() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter(); // Initialize the router

  const sendDataBackend = async () => {
    try {
      // Sign in the user with Firebase Authentication
      if (!auth) {
        throw new Error("Firebase auth is not initialized.");
      }

      await signInWithEmailAndPassword(auth, email, password);
      console.log("Attempting login with:", email, password);


      setMessage("Logged in successfully!"); // Set success message
      console.log("User logged in");

      // Redirect to the main page (you can change this to your desired path)
      router.push("/components/mainpage"); // Replace "/main" with your actual route
    } catch (err) {
      if (err instanceof FirebaseError && err.code === "auth/invalid-email") {
        setMessage("Invalid email format.");
      } else if (err instanceof FirebaseError && err.code === "auth/user-not-found") {
        setMessage("User not found.");
      } else if (err instanceof FirebaseError && err.code === "auth/wrong-password") {
        setMessage("Wrong password.");
      } else {
        setMessage("An error occurred. Please try again.");
      }
      console.error("Error signing in:", (err as FirebaseError).message);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/img11.jpg')", 
      }}
      className="h-screen w-full bg-cover bg-center"
    >
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white text-black flex flex-col gap-2 m-11 p-11 pl-5 pr-5 w-96 h-96 items-center justify-center rounded-md text-[18px]">
          <p className={message.includes("Invalid") ? "text-red-600" : "text-green-600"}>
            {message}
          </p>

          

          <label className="p-2">Email</label>
          <input
            className="border-2 border-black rounded-lg p-2 w-72"
            type="email" // Make sure the input type is email
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="p-2">Password</label>
          <input
            className="border-2 border-black rounded-lg p-2 w-72"
            type="password" // Password input field
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white text-1xl p-2 mt-6 rounded-md w-32 hover:shadow-lg transition-shadow duration-300 hover:opacity-50"
            onClick={sendDataBackend} // Call Firebase sign-in function
          >
            Log In
          </button>

          <div className="flex flex-row ">
            <h4 className="text-[15px] mt-9 ">
              Don't have an account?
              <Link href="/components/SignUp" className="text-blue-500 hover:underline ml-2">
                Register
              </Link>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
