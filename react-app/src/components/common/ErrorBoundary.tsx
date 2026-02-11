import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="container-fluid">
          <div className="row clearfix" style={{ marginTop: '50px' }}>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="card">
                <div className="header bg-red">
                  <h2>Something went wrong</h2>
                </div>
                <div className="body">
                  <p>An unexpected error occurred. Please refresh the page or contact support.</p>
                  {this.state.error && (
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                      <summary>Error details</summary>
                      <p>{this.state.error.toString()}</p>
                      <p>{this.state.error.stack}</p>
                    </details>
                  )}
                  <button
                    onClick={() => window.location.reload()}
                    className="btn btn-primary waves-effect"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
