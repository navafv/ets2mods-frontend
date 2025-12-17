// src/components/QueryErrorBoundary.jsx
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-6 border border-red-800 bg-red-900/20 rounded-lg">
      <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
      <pre className="text-sm bg-black p-3 rounded mb-4 overflow-auto">
        {error.message}
      </pre>
      <div className="flex gap-3">
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
        >
          Refresh page
        </button>
      </div>
    </div>
  );
}

export default function QueryErrorBoundary({ children }) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary
      onReset={reset}
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        // Log errors to your error tracking service
        console.error('Query Error:', error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}