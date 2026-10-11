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
        <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-5 py-24">
          <div className="max-w-md w-full bg-white border border-[#E5E5E5] p-10 text-center">
            <div className="w-12 h-12 border border-[#111111] flex items-center justify-center mx-auto mb-6 text-[#111111]">
              <span className="text-xl font-serif">✦</span>
            </div>
            
            <h1 className="font-heading text-2xl md:text-3xl text-[#111111] font-normal mb-3">
              An Unexpected Error Occurred
            </h1>
            
            <p className="text-[#6B6B6B] text-xs leading-relaxed mb-8">
              We encountered an issue loading this page. Please try refreshing or return to the Suyog Jewelry homepage.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-[#111111] text-white border border-[#111111] hover:bg-white hover:text-[#111111] font-medium px-6 py-3 transition-colors text-xs uppercase tracking-[0.18em]"
              >
                Reload
              </button>
              <button
                onClick={this.handleReset}
                className="bg-white text-[#111111] border border-[#E5E5E5] hover:border-[#111111] font-medium px-6 py-3 transition-colors text-xs uppercase tracking-[0.18em]"
              >
                Return Home
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
