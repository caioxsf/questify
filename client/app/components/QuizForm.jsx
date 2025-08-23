'use client'

import { useState } from 'react'



export default function QuizForm({ onSubmit, loading }) {
  const [content, setContent] = useState('')
  const [difficulty, setDifficulty] = useState(1)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content.trim(), difficulty)
    }
  }

  const difficultyLabels = {
    1: 'Fácil',
    2: 'Médio',
    3: 'Difícil'
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Tema da Pergunta
            </label>
            <input
              type="text"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ex: História do Brasil, Matemática, Ciências..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dificuldade
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    difficulty === level
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Gerando pergunta...
              </div>
            ) : (
              '🎯 Gerar Pergunta'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}