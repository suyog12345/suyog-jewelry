import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-cream-200 p-8 text-center">
            <div className="w-16 h-16 bg-maroon-50 rounded-full flex items-center justify-center mx-auto mb-6 text-maroon-700">
              <span className="text-3xl font-serif">✧</span>
            </div>
            
            <h1 className="font-heading text-2xl md:text-3xl text-dark mb-3">
              Something went wrong
            </h1>
            
            <p className="text-gray-warm text-sm leading-relaxed mb-8">
              We encountered an unexpected issue while loading this page. Please try refreshing or return to our homepage.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-gold-500 hover:bg-gold-600 text-dark font-medium px-6 py-2.5 rounded transition-colors text-sm uppercase tracking-wider"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="border border-dark text-dark hover:bg-cream-100 font-medium px-6 py-2.5 rounded transition-colors text-sm uppercase tracking-wider"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
