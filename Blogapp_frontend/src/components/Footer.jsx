import React from "react";

function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center md:text-left">

        <div>
          <h2 className="text-2xl font-bold">Article Hub</h2>
          <p className="text-gray-400 mt-2">
            Share knowledge. Inspire readers.
          </p>
        </div>


     
        <div>
          <h3 className="font-semibold mb-2">Connect</h3>
          <p className="text-gray-400">support@articlehub.com</p>

          <div className="flex justify-center md:justify-start gap-4 mt-3">
            <span className="hover:text-blue-400 cursor-pointer">
              GitHub
            </span>
            <span className="hover:text-blue-400 cursor-pointer">
              LinkedIn
            </span>
            <span className="hover:text-blue-400 cursor-pointer">
              Twitter
            </span>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
        {new Date().getFullYear()} Article Hub. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;