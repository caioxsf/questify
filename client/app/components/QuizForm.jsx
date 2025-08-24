// components/QuizForm.jsx
import { useState, useEffect } from 'react'

export default function QuizForm({ onSubmit, loading, initialData }) {
  const [content, setContent] = useState('')
  const [difficulty, setDifficulty] = useState(1)

  // Carregar dados iniciais quando o componente monta ou initialData muda
  useEffect(() => {
    if (initialData) {
      setContent(initialData.content || '')
      setDifficulty(initialData.difficulty ?? 1)
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content.trim(), difficulty)
    }
  }

  const difficultyOptions = [
    { label: 'Fácil', value: 1 },
    { label: 'Médio', value: 2 },
    { label: 'Difícil', value: 3 },
  ]

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Tema da pergunta:
        </label>
        <input
          type="text"
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Ex: História do Brasil, Matemática..."
          className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dificuldade:
        </label>

        <div className="flex gap-2">
          {difficultyOptions.map((opt) => {
            const selected = difficulty === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDifficulty(opt.value)}
                aria-pressed={selected}
                className={
                  (selected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50') +
                  ' px-4 py-2 rounded-md transition w-full'
                }
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Gerando pergunta...' : 'Gerar Pergunta'}
      </button>
    </form>
  )
}