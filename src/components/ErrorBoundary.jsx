import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    console.log(this.props);
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      console.log(this.props);

      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
