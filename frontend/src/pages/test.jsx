    import { useState } from "react";
    import Logo from "../components/logo/Logo";
    import { DocumentTextIcon } from "@heroicons/react/24/outline";

    const Layout = ({ children }) => {
    const [docsOpen, setDocsOpen] = useState(false);

    return (
        <div className="h-screen flex bg-gradient-to-r from-[#6A1B5B] to-[#2EBA9F] overflow-hidden">

        {/* ===================== */}
        {/* Desktop Sidebar */}
        {/* ===================== */}
        <aside className="
            hidden md:flex
            w-72
            bg-black/30 backdrop-blur-lg
            text-white
            p-6
            flex-col
        ">
            {/* Logo at top */}
        <div className="mb-6">
          <Logo width="w-32" height="h-32" />
        </div>
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5" />
            Documents
            </h2>

            <ul className="space-y-3 overflow-auto">
            <li className="bg-white/10 px-4 py-3 rounded-lg">File 1</li>
            <li className="bg-white/10 px-4 py-3 rounded-lg">File 2</li>
            <li className="bg-white/10 px-4 py-3 rounded-lg">File 3</li>
            </ul>
        </aside>

        {/* ===================== */}
        {/* Main Area */}
        {/* ===================== */}
        <div className="flex-1 flex flex-col relative">

            {/* Mobile Header */}
            <header className="flex md:hidden p-4 items-center shadow-xl rounded-xl justify-between">
            <Logo width="w-28" />

            <button
                onClick={() => setDocsOpen(true)}
                className="
                flex items-center gap-2
                px-3 py-2
                rounded-xl
                text-sm font-medium text-white
                bg-white/30
                hover:bg-white/20
                transition
                "
            >
                <DocumentTextIcon className="h-5 w-5" />
                Docs
            </button>
            </header>

            {/* Content */}
            <main className="flex-1  overflow-auto md:overflow-hidden md:h-screen">
    {children}
    </main>

        </div>

        {/* ===================== */}
        {/* Mobile Docs Panel */}
        {/* ===================== */}
        <div
            className={`
            fixed inset-x-0 top-0 z-50 md:hidden
            bg-black/60 backdrop-blur-md text-white
            transform transition-transform duration-300 ease-out
            ${docsOpen ? "translate-y-0" : "-translate-y-full"}
            `}
        >
            <div className="p-6 rounded-b-2xl shadow-xl max-h-[80vh] overflow-auto">

            {/* Drag Handle */}
            <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">

                <h2 className="text-lg font-semibold flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5" />
                Documents
                </h2>

                <button
                onClick={() => setDocsOpen(false)}
                className="text-xl"
                >
                ✕
                </button>
            </div>

            {/* Docs */}
            <ul className="space-y-3">
                
                <li className="bg-white/10 px-4 py-3 rounded-lg">File 1</li>
                <li className="bg-white/10 px-4 py-3 rounded-lg">File 2</li>
                <li className="bg-white/10 px-4 py-3 rounded-lg">File 3</li>
            </ul>
            </div>
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
