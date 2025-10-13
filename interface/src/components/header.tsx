import React, { useState, type FormEvent } from "react";
import { signUpUser, signInUser } from "../services/auth";

export default function Header() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState<"signin" | "signup" | "">("");

  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const openPopup = (type: "signin" | "signup") => {
    setPopupType(type);
    setShowPopup(true);
    setMenuOpen(false);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupType("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleAuth = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (popupType === "signin") {
      try {
        signInUser(email, password);
        setIsSignedIn(true);
      } catch (e) {
        return e;
      }
      alert("Signed in successfully!");
    } else {
      setIsSignedIn(true);
      try {
        signUpUser(userName, password, email);
      } catch (e) {
        return e;
      }
      alert("Account created successfully!");
    }
    closePopup();
  };

  return (
    <header className="p-6 relative z-50 border-b border-slate-700 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left: User button */}
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="rounded-full px-4 py-2 bg-amber-50"
          >
            <p className="text-amber-800">{isSignedIn ? userName : "User"}</p>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute left-0 mt-2 w-40 rounded-md bg-white shadow-lg border">
              {isSignedIn ? (
                <ul className="py-1 text-sm text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Settings
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setIsSignedIn(false);
                      setMenuOpen(false);
                    }}
                  >
                    Sign out
                  </li>
                </ul>
              ) : (
                <ul className="py-1 text-sm text-gray-700">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => openPopup("signin")}
                  >
                    Sign In
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => openPopup("signup")}
                  >
                    Sign Up
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
        {/* Center title */}
        <div className="text-center flex-1">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
            PaperPal AI
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload a document and chat with it
          </p>
        </div>
        <div className="w-[80px]" /> {/* right side spacer */}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
          <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
              {popupType === "signin" ? "Sign In" : "Sign Up"}
            </h2>

            <form onSubmit={handleAuth} className="flex flex-col space-y-3">
              {popupType === "signup" && (
                <input
                  type="text"
                  placeholder="User Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 text-black"
                  autoComplete="user-name"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 text-black"
                autoComplete="email"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 text-black"
                autoComplete="password"
              />
              {popupType === "signup" && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 text-black"
                  autoComplete="new-password"
                />
              )}
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                {popupType === "signin" ? "Sign In" : "Create Account"}
              </button>
              <button
                type="button"
                onClick={closePopup}
                className="text-gray-500 text-sm hover:underline mt-1"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
