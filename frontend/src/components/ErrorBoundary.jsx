import { Component } from 'react'
import { logError, getErrorMessage } from '../utils/errorHandler.js'

/**
 * Catches render-time errors anywhere below it so a single broken module
 * degrades to a recoverable screen instead of a blank page.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    this.setState({ errorInfo: info })
    logError(error, { componentStack: info?.componentStack })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleDashboard = () => {
    this.setState({ error: null, errorInfo: null })
    window.location.assign('/dashboard')
  }

  render() {
    if (!this.state.error) return this.props.children

    const errorMessage = this.state.error?.message || getErrorMessage(this.state.error)

    return (
      <div className="error-screen" role="alert">
        <div className="error-screen-card">
          <h1 className="error-screen-title">Something went wrong</h1>
          <p className="error-screen-text">
            This section could not be rendered. The rest of the app is still available.
          </p>
          <pre className="error-screen-detail">{errorMessage}</pre>
          {import.meta.env.DEV && this.state.errorInfo && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400">Show technical details</summary>
              <pre className="error-screen-detail mt-2">{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
          <div className="error-screen-actions">
            <button type="button" className="btn btn-primary" onClick={this.handleDashboard}>
              Back to dashboard
            </button>
            <button type="button" className="btn btn-secondary" onClick={this.handleReload}>
              Reload page
            </button>
          </div>
        </div>
      </div>
    )
  }
}
