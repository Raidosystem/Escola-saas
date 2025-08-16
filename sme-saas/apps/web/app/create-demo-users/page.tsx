'use client'

import { useState } from 'react'

export default function CreateDemoUsersPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const createDemoUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/create-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      setResults({ error: 'Failed to create demo users', details: error })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Create Demo Users
        </h1>
        
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-4">
            This will create demo users for testing the SME SaaS application.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Demo Users:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• admin@demo.com / 123456 (Admin)</li>
              <li>• secretaria@demo.com / 123456 (Secretaria)</li>
              <li>• professor@demo.com / 123456 (Professor)</li>
              <li>• aluno@demo.com / 123456 (Aluno)</li>
            </ul>
          </div>
          
          <button
            onClick={createDemoUsers}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            {isLoading ? 'Creating Users...' : 'Create Demo Users'}
          </button>
        </div>
        
        {results && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-3">Results:</h3>
            <pre className="text-xs overflow-auto text-gray-700">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
        
        {results?.success && (
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Go to Login Page
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
