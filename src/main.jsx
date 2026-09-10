import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xl flex-shrink-0">
                ⚠️
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">New Utkal Finance Limited</h2>
                <p className="text-xs text-slate-400">Portal encountered a rendering exception.</p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-red-300 overflow-x-auto max-h-48 whitespace-pre-wrap">
              {this.state.error?.toString() || 'Unknown Error'}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              If this was caused by corrupted browser session state, clicking "Reset Session &amp; Reload" will clear cached data and restore the portal.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                  } catch {}
                  window.location.hash = '';
                  window.location.reload();
                }}
                className="flex-1 py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-colors text-center cursor-pointer shadow-md"
              >
                Reset Session &amp; Reload
              </button>
              <button
                onClick={() => {
                  window.location.hash = '';
                  window.location.reload();
                }}
                className="py-3 px-5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-colors text-center cursor-pointer"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
