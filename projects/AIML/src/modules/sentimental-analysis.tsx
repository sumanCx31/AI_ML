import React, { useState, useEffect } from 'react';

// Define the shape of your backend response data
interface AnalysisResult {
  original_text: string;
  sentiment: string;
  probability: number;
}

export default function SentimentChecker() {
  const [text, setText] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isServerReady, setIsServerReady] = useState<boolean>(false);

  // Live Render backend URL
  const API_URL = "https://sentimental-analysis-backend-mb6f.onrender.com";
  // const API_URL = "http://127.0.0.1:8000"; // For local development

  // Automatically wake up the Render server in the background on page load
  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((res) => {
        if (res.ok) setIsServerReady(true);
      })
      .catch(() => {
        // Ignore background ping errors if server is still sleeping
      });
  }, []);

  const handleAnalyze = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // Give it 60 seconds if it's a cold start
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('The server took too long to wake up. Please try clicking Analyze again now that it is awake.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl border border-gray-100 font-sans">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🧠 AI Sentiment Analysis
      </h2>
      
      <form onSubmit={handleAnalyze} className="space-y-4">
        <div>
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a sentence, movie review, or feedback here..."
            className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400 shadow-sm transition"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            'Analyze Sentiment'
          )}
        </button>
      </form>

      {/* Dynamic status helper */}
      {loading && (
        <p className="text-xs text-gray-500 text-center mt-3 animate-pulse">
          {isServerReady 
            ? '⏳ Processing text through TensorFlow...' 
            : '⏳ Waking up server from cold start (may take up to 45s on first load)...'}
        </p>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-3 transition-all">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Analysis Results</h3>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Original Text:</span> "{result.original_text}"
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Sentiment:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              result.sentiment === 'Positive' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {result.sentiment}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Probability Score:</span>
            <span className="text-sm font-semibold text-gray-800">{result.probability}</span>
          </div>
        </div>
      )}
    </div>
  );
}