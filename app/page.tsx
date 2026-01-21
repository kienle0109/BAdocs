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
        <div className="grid md:grid-3 gap-8 mb-12">
          {/* Feature 1: Generate BRD */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Generate BRD
            </h3>
            <p className="text-gray-300 mb-4">
              Create professional Business Requirements Documents from your input using AI
            </p>
            <a
              href="/new"
              className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              Create BRD
            </a>
          </div>

          {/* Feature 2: Transform */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <div className="text-3xl mb-4">🔄</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Transform Documents
            </h3>
            <p className="text-gray-300 mb-4">
              Convert BRD → SRS → FRD automatically following standards
            </p>
            <a
              href="/documents"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              View Documents
            </a>
          </div>

          {/* Feature 3: Export */}
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
            <div className="text-3xl mb-4">📥</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Export Markdown
            </h3>
            <p className="text-gray-300 mb-4">
              Download documents as formatted Markdown with metadata
            </p>
            <button
              className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              disabled
            >
              Coming Soon
            </button>
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
