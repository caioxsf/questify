'use client'

import { useState } from 'react'
import QuizForm from './components/QuizForm'
import QuizDisplay from './components/QuizDisplay'


export default function Home() {
  const [quizData, setQuizData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerateQuiz = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, difficulty }),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar pergunta')
      }

      const data = await response.json()
      setQuizData(data)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao gerar pergunta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleNewQuiz = () => {
    setQuizData(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🧠 Quiz Game
          </h1>
          <p className="text-gray-600">
            Gere perguntas personalizadas para seu jogo de quiz
          </p>
        </div>

        {!quizData ? (
          <QuizForm onSubmit={handleGenerateQuiz} loading={loading} />
        ) : (
          <QuizDisplay quizData={quizData} onNewQuiz={handleNewQuiz} />
        )}
      </div>
    </div>
  )
}