"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebase/config"; // Ensure db is exported from your Firebase config
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";

const Home = () => {
  const [message, setMessage] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<{ id: string, text: string, email: string, timestamp: any }[]>([]);
  const [_isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      console.error("Firebase Auth is not initialized.");
      return;
    }

    let unsubscribeFirestore: () => void; // Declare unsubscribeFirestore here

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/");
      } else {
        setIsLoggedIn(true);
        setUserEmail(user.email);
        // Fetch messages from Firestore
        const q = query(collection(db, "msgGlobal"), orderBy("timestamp"));
        unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
          const msgs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            text: doc.data().text,
            email: doc.data().email,
            timestamp: doc.data().timestamp
          }));
          setMessages(msgs);
        });
      }
    });

    // Cleanup function for useEffect
    return () => {
      unsubscribeAuth(); // Unsubscribe from auth listener
      if (unsubscribeFirestore) {
        unsubscribeFirestore(); // Unsubscribe from Firestore listener if it exists
      }
    };
  }, [router]);

  const handleSendMessage = async () => {
    if (message.trim() !== "" && userEmail) {
      try {
        await addDoc(collection(db, "msgGlobal"), {
          text: message,
          email: userEmail,
          timestamp: serverTimestamp()
        });
        setMessage("");
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-6 flex flex-col shadow-xl rounded-r-lg">
        <div className="text-xl font-semibold mb-6 flex items-center">
          <span className="text-white bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
            {userEmail}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-8">Chatroom</h1>
        <div className="flex-1">
          <ul>
            <li className="mb-4 hover:bg-blue-700 p-2 rounded-lg">General</li>
            <li className="mb-4 hover:bg-blue-700 p-2 rounded-lg">Tech Talk</li>
            <li className="mb-4 hover:bg-blue-700 p-2 rounded-lg">Random</li>
          </ul>
        </div>
        <div className="mt-6 text-center">
          <button className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition duration-300">
            Log Out
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white shadow-lg rounded-l-lg text-black">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-gray-100 p-3 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300">
                <p><strong>{msg.email}:</strong> {msg.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 border-t border-gray-300">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;