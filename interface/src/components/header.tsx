// import React from "react";

// export default function Header() {
//   return (
//     <header className="p-6 border-b border-slate-700 shadow-md">
//       <h1 className="text-2xl font-extrabold text-center bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
//         PaperPal AI
//       </h1>
//       <p className="text-sm text-center text-slate-400 mt-1">
//         Upload a document and chat with it
//       </p>
//       <button className="rounded-full border-20 bg-amber-50">
//         <p className="text-amber-800">User</p>
//       </button>
//     </header>
//   );
// }

import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

export default function Header() {
  // const navigate = useNavigate();
  // simulate authentication state
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="p-6 relative z-50 border-b border-slate-700 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left: User button */}
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="rounded-full px-4 py-2 bg-amber-50"
          >
            <p className="text-amber-800">User</p>
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
                    onClick={() => alert("Sign In")}
                  >
                    Sign In
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => alert("Sign Up")}
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
    </header>
  );
}
