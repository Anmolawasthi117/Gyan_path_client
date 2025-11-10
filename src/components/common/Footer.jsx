import React, { useState, useEffect, useRef } from "react";
import { Info, Github, Linkedin, Mail, MessageSquare } from "lucide-react";
import anmol from "../../assets/anmol.jpeg";
import nandini from "../../assets/nandini.jpeg";

const Footer = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [viewCount, setViewCount] = useState(null);

  // 👇 Prevent React 18 Strict Mode double-call in dev
  const hasIncremented = useRef(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/views");
        const data = await res.json();
        setViewCount(data.count);
      } catch (err) {
        console.error("Failed to fetch global view count:", err);
      }
    };

    // run only once per real page load
    if (!hasIncremented.current) {
      fetchCount();
      hasIncremented.current = true;
    }
  }, []);

  return (
    <>
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white shadow-inner border-t border-gray-200 py-2.5 px-4 z-50">
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
          {/* Text section */}
          <div className="truncate">
            © 2025{" "}
            <span
              onClick={() => setShowHelp(true)}
              className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition"
              title="How to Navigate"
            >
              GyanPath
            </span>{" "}
            · Engineered by{" "}
            <span
              onClick={() => setShowContact(true)}
              className="text-gray-800 cursor-pointer hover:text-blue-600 transition"
              title="Contact Anmol"
            >
              Anmol
            </span>{" "}
            &{" "}
            <span
              onClick={() => setShowContact(true)}
              className="text-gray-800 cursor-pointer hover:text-blue-600 transition"
              title="Contact Nandini"
            >
              Nandini
            </span>
          </div>

          {/* Buttons Section */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-xs sm:text-sm transition"
            >
              <Info size={14} />
              <span className="hidden sm:inline">How to Navigate</span>
            </button>

            <a
              href="https://forms.gle/vbZHzFdV8WAhCZEDA"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs sm:text-sm transition"
            >
              <MessageSquare size={14} />
              <span className="hidden sm:inline">Feedback</span>
            </a>
          </div>
        </div>
      </footer>

      {/* ---------- How to Navigate Modal ---------- */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-[999]"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:w-[420px] max-h-[80vh] overflow-y-auto p-5 sm:p-6 text-gray-700 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-800 text-lg">
                How to Navigate with GyanPath
              </h4>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-500 hover:text-gray-700 transition text-sm"
              >
                ✕
              </button>
            </div>

            <ul className="list-disc list-inside space-y-2 text-[14px] leading-relaxed">
              <li>
                <span className="font-medium">Set Your Start:</span> Double-tap your
                location on the map or search your nearest location in the search bar
                to drop the{" "}
                <span className="text-green-600 font-semibold">green starting pin</span>.
              </li>
              <li>
                <span className="font-medium">Find Your Destination:</span> Use the
                top search bar to type your destination (e.g.,{" "}
                <span className="italic">Library</span> or{" "}
                <span className="italic">Room 301</span>).
              </li>
              <li>
                <span className="font-medium">Select & Go:</span> Pick your destination
                — your route appears as a{" "}
                <span className="text-blue-600 font-semibold">blue line</span>.
              </li>
            </ul>

            <div className="mt-3 border-t border-gray-200 pt-2">
              <p className="text-xs text-gray-600 sm:text-[13px]">
                <span className="font-semibold">Note:</span> If your route includes
                stairs or an elevator, the map{" "}
                <span className="font-semibold">won’t switch floors automatically</span>.
                Tap the{" "}
                <span className="font-medium text-gray-800">⏩ map button</span> in the
                bottom-left to change floors.
              </p>
            </div>

            {/* 🔥 Global View Count */}
            <div className="mt-4 flex justify-center items-center gap-1 text-gray-500 text-xs">
              <span>
                {viewCount !== null
                  ? `This site has been opened ${viewCount} times globally`
                  : "Loading view count..."}
              </span>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowHelp(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition w-full sm:w-auto"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Contact Modal ---------- */}
      {showContact && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-[999]"
          onClick={() => setShowContact(false)}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:w-[500px] max-h-[80vh] overflow-y-auto p-5 sm:p-6 text-gray-700 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-800 text-lg">Meet the Developers</h4>
              <button
                onClick={() => setShowContact(false)}
                className="text-gray-500 hover:text-gray-700 transition text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Anmol */}
              <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
                <img
                  src={anmol}
                  alt="Anmol"
                  className="w-20 h-20 rounded-full object-cover mb-2"
                />
                <h5 className="font-semibold text-gray-800">Anmol</h5>
                <p className="text-xs text-gray-600 mb-2">Full Stack Developer</p>
                <div className="flex gap-3 justify-center text-gray-600">
                  <a
                    href="https://github.com/Anmolawasthi117"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/anmol-awasthi11117"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a href="mailto:anmolawasthi117@gmail.com">
                    <Mail size={18} />
                  </a>
                </div>
              </div>

              {/* Nandini */}
              <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition">
                <img
                  src={nandini}
                  alt="Nandini"
                  className="w-20 h-20 rounded-full object-cover mb-2"
                />
                <h5 className="font-semibold text-gray-800">Nandini</h5>
                <p className="text-xs text-gray-600 mb-2">Product & UX Designer</p>
                <div className="flex gap-3 justify-center text-gray-600">
                  <a
                    href="https://www.linkedin.com/in/nandini-nikhade-5111b2288/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin size={18} />
                  </a>
                  <a href="mailto:nandini.nic03@gmail.com">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={() => setShowContact(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
