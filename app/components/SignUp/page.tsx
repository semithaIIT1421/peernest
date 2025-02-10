"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";  // Adjusted import path
import Link from 'next/link'; // Import Link from next/link

export default function Home() {
  const [user, setUser] = useState(""); // To store the email
  const [password, setPassword] = useState(""); // To store the password

  // Firebase sign-up function
  const sendDataBackend = async () => {
    if (!auth) {
      console.error("Firebase auth is not initialized");
      return;
    }

    try {
      // Use Firebase Authentication to create a new user
      await createUserWithEmailAndPassword(auth, user, password);

      console.log("User signed up successfully!");
      alert("User signed up successfully!");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error signing up:", err.message);
        alert("Error signing up: " + err.message);
      } else {
        console.error("Error signing up:", err);
        alert("Error signing up: " + err);
      }
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/img11.jpg')", // Use the correct path here
      }}
      className="h-screen w-full bg-cover bg-center"
    >
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white text-black flex flex-col gap-3 m-11 p-11 pl-5 pr-5 w-96 h-96 items-center justify-center rounded-md text-[18px]">
          <label className="p-2">Username (Email)</label>
          <input
            className="border-2 border-black rounded-lg p-2 w-72"
            type="email"
            value={user}
            onChange={(e) => setUser(e.target.value)} // Update email state
          />

          <label className="p-2">Password</label>
          <input
            className="border-2 border-black rounded-lg p-2 w-72"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
          />

          <button
            className="bg-blue-600 text-white text-1xl p-2 mt-6 rounded-md w-32 hover:shadow-lg transition-shadow duration-300 hover:opacity-50"
            onClick={sendDataBackend} // Call Firebase sign-up function
          >
            Sign Up
          </button>

          <div className="flex flex-row ">
            <h4 className="text-[15px] mt-9 ">
              Already have an account?  
              <Link href="/login" className="text-blue-500 hover:underline ml-2">
                Log In 
              </Link>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
