"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "./firebase/config";
import Link from "next/link";
import { FirebaseError } from "firebase/app";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const sendDataBackend = async () => {
    try {
      if (!auth) {
        throw new Error("Firebase auth is not initialized.");
      }

      console.log("Attempting login with:", email, password);
      await signInWithEmailAndPassword(auth, email, password);

      setMessage("Logged in successfully!");
      console.log("User logged in");

      router.push("/components/mainpage");
    } catch (err) {
      let errorMessage = "An error occurred. Please try again.";

      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/invalid-email":
            errorMessage = "Invalid email format.";
            break;
          case "auth/user-not-found":
            errorMessage = "User not found.";
            break;
          case "auth/wrong-password":
            errorMessage = "Wrong password.";
            break;
          default:
            errorMessage = err.message || errorMessage;
        }
      }

      setMessage(errorMessage);
      console.error("Error signing in:", errorMessage);
    }
  };

  return (
    <div className="h-screen w-full bg-cover bg-center" style={{ backgroundImage: "url('/img11.jpg')" }}>
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white text-black flex flex-col gap-2 p-11 w-96 h-96 items-center justify-center rounded-md text-[18px] shadow-lg">
          {message && (
            <p className={`text-center ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}

          <label className="p-2">Email</label>
          <input
            className="border-2 border-black rounded-lg p-2 w-72"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="p-2">Password</label>
          <input
            className="border-2 border-black rounded-lg p-2 w-72"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white text-1xl p-2 mt-6 rounded-md w-32 hover:shadow-lg transition duration-300 hover:opacity-50"
            onClick={sendDataBackend}
          >
            Log In
          </button>

          <div className="mt-6">
            <h4 className="text-[15px]">
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
