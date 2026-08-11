import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "40px", textAlign: "center", fontFamily: "Outfit, sans-serif" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>Something went wrong</h1>
          <p style={{ color: "#888", marginBottom: "20px" }}>
            {this.state.error.message}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
