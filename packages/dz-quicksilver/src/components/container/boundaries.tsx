import * as React from 'react';

export interface IBoundaryProps {
  [key: string]: any
}

export default class IBoundary extends React.Component<IBoundaryProps, any> {
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error: any, info: any) {
    // You can also log the error to an error reporting service
  }
  render() {
    const { hasError } = this.state
    return hasError ? <h1>Something went wrong.</h1> : this.props.children
  }
}

