import { Header } from '@/components/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-12">
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
              Create Software Requirements Specifications directly from your technical requirements
            </p>
            <span className="inline-flex items-center px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Coming Soon
            </span>
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
              Create Functional Requirements Documents to detail system functionality
            </p>
            <span className="inline-flex items-center px-4 py-2 bg-gray-600/50 text-gray-300 rounded-lg font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Coming Soon
            </span>
          </div>

          {/* Feature 4: Document History */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-lg bg-orange-600/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors">
              Document History
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              View and manage all your previously generated documents in one place
            </p>
            <a
              href="/history"
              className="inline-flex items-center px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-medium cursor-pointer"
            >
              View History
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* AI Provider Info */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-white">AI Support</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-lg p-5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Ollama (Local)</h3>
              <p className="text-gray-400 text-sm">Completely offline, private, and unlimited usage. Perfect for sensitive data.</p>
            </div>
            <div className="bg-white/5 rounded-lg p-5 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Gemini Free (Cloud)</h3>
              <p className="text-gray-400 text-sm">Fast, powerful, and free tier available. Great for quick generation.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Following IEEE 29148, IEEE 830 & IIBA BABOK v3 Standards</p>
        </footer>
      </div>
    </main>
  );
}
