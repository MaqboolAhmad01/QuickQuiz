import { useState } from "react";
import Logo from "../components/logo/Logo";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/outline";
import LogoutButton from "./LogoutButton";


const Layout = ({ children, files = [] }) => {
  const [docsOpen, setDocsOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gradient-to-r from-[#6A1B5B] to-[#2EBA9F] overflow-hidden">

      <aside className="
  hidden md:flex
  w-72
  bg-black/30 backdrop-blur-lg
  text-white
  p-6
  flex-col
">

        {/* Logo */}
        <div className="mb-6">
          <Logo width="w-32" height="h-32" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <DocumentTextIcon className="h-5 w-5" />
          Documents
        </h2>

        {/* IMPORTANT PART */}
        <div className="flex flex-col flex-1 overflow-auto">

          {/* Scrollable list */}
          <ul className="flex-1 space-y-3 ">
            {files.length > 0 ? (
              files.map((file, idx) => (
                <li key={idx} className="bg-white/10 px-4 py-3 rounded-lg">
                  {file.name || file}
                </li>
              ))
            ) : (
              <li className="text-gray-400">No files available</li>
            )}
          </ul>


        </div>
        <div className="bg-white/20 p-3 mt-4  text-sm rounded-lg text-center">

        </div>
        {/* Logout pinned bottom */}
        <div className="mt-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-auto relative">

        {/* Mobile Header */}
        <header className="flex md:hidden p-4 items-center  rounded-xl justify-between">
          {/* Hamburger on Left */}
          <button
            onClick={() => setDocsOpen(true)}
            className="p-2 rounded-lg shadow-xl bg-white/10 hover:bg-white/40 transition"
          >
            <Bars3Icon className="h-8 w-8 text-white" />
          </button>
          <Logo width="w-28" />

        </header>

        {/* Content */}
        <main className="flex-1  md:overflow-hidden md:h-screen">
          {children}
        </main>

      </div>

      {/* Mobile Docs Panel */}
      <div
        className={`
          fixed flex flex-col justify-between p-4  left-0 h-screen w-72 z-50 md:hidden
          bg-black/60 backdrop-blur-md text-white
          transform transition-transform duration-500 ease-out
          ${docsOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6  rounded-b-2xl shadow-xl  overflow-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <DocumentTextIcon className="h-5 w-5" />
              Documents
            </h2>

            <button onClick={() => setDocsOpen(false)} className="text-xl">
              ✕
            </button>
          </div>

          {/* Docs */}
          <ul className="space-y-3 ">
            {files.length > 0 ? (
              files.map((file, idx) => (
                <li key={idx} className="bg-white/10 px-3 py-3 rounded-lg">
                  {file.name || file}
                </li>
              ))
            ) : (
              <li className="text-gray-400">No files available</li>
            )}

          </ul>
        </div>
        <LogoutButton />

      </div>

      {/* Mobile Backdrop */}
      {docsOpen && (
        <div
          onClick={() => setDocsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

    </div>
  );
};

export default Layout;
