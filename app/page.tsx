export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            BA Documentation Generator
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Transform business requirements into professional documents with AI
          </p>
          <p className="text-gray-400">
            BRD → SRS → FRD | IEEE & IIBA Standards
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Feature 1: Generate BRD */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
              Generate BRD
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              Create professional Business Requirements Documents from your input using AI
            </p>
            <a
              href="/new"
              className="inline-flex items-center px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium cursor-pointer"
            >
              Create BRD
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Feature 2: Generate SRS (Coming Soon) */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 opacity-75 group">
            <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Generate SRS
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              Create Software Requirements Specification from scratch or transform from BRD
            </p>
            <button
              disabled
              className="inline-flex items-center px-5 py-2 bg-white/10 text-gray-400 rounded-lg font-medium cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Coming Soon
            </button>
          </div>

          {/* Feature 3: Generate FRD (Coming Soon) */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 opacity-75 group">
            <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Generate FRD
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              Create Functional Requirements Document from scratch or transform from SRS
            </p>
            <button
              disabled
              className="inline-flex items-center px-5 py-2 bg-white/10 text-gray-400 rounded-lg font-medium cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Coming Soon
            </button>
          </div>

          {/* Feature 4: Document History */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-lg bg-cyan-600/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
              Document History
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              View and manage all your generated documents in one place
            </p>
            <a
              href="/history"
              className="inline-flex items-center px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition font-medium cursor-pointer"
            >
              View History
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* AI Provider Info */}
        <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">
            ⚡ Dual AI Support
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-purple-400 font-medium mb-1">Ollama (Local)</p>
              <p className="text-sm text-gray-400">
                100% offline, private, unlimited usage
              </p>
            </div>
            <div>
              <p className="text-blue-400 font-medium mb-1">Gemini Free (Cloud)</p>
              <p className="text-sm text-gray-400">
                Fast, smart, 15 requests/min (free tier)
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Following IEEE 29148, IEEE 830 & IIBA BABOK v3 Standards</p>
        </div>
      </div>
    </main>
  );
}
