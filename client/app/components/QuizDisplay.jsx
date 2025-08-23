'use client'

import { useState } from 'react'
import { QuizData } from '../page'



export default function QuizDisplay({ quizData, onNewQuiz }) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const options = [
    { key: 'a', label: 'A', value: quizData.alternativas.a },
    { key: 'b', label: 'B', value: quizData.alternativas.b },
    { key: 'c', label: 'C', value: quizData.alternativas.c },
    { key: 'd', label: 'D', value: quizData.alternativas.d },
  ]

  const handleOptionClick = () => {
    setSelectedOption(optionKey)
  }

  const handleRevealAnswer = () => {
    setShowAnswer(true)
  }

  const getOptionStyle = () => {
    if (!showAnswer && !selectedOption) {
      return 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300'
    }
    
    if (!showAnswer && selectedOption === optionKey) {
      return 'bg-blue-100 border-blue-400'
    }
    
    if (showAnswer && optionKey === quizData.resposta_correta) {
      return 'bg-green-100 border-green-400 text-green-800'
    }
    
    if (showAnswer && selectedOption === optionKey && optionKey !== quizData.resposta_correta) {
      return 'bg-red-100 border-red-400 text-red-800'
    }
    
    return 'bg-gray-50 border-gray-200 text-gray-600'
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Pergunta */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-relaxed">
            {quizData.pergunta}
          </h2>
        </div>

        {/* Alternativas */}
        <div className="grid gap-4 mb-8">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => handleOptionClick(option.key)}
              className={`p-4 rounded-xl border-2 text-left transition-all transform hover:scale-102 ${getOptionStyle(option.key)}`}
            >
              <div className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-sm mr-4">
                  {option.label}
                </span>
                <span className="text-lg">{option.value}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!showAnswer ? (
            <button
              onClick={handleRevealAnswer}
              disabled={!selectedOption}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-8 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            >
              ✨ Revelar Resposta
            </button>
          ) : (
            <div className="text-center">
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-lg text-blue-800 mb-2">
                  Resposta Correta: {quizData.resposta_correta.toUpperCase()}
                </h3>
                <p className="text-blue-700">
                  {quizData.explicacao}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Botão Nova Pergunta */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onNewQuiz}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-8 rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 active:scale-95"
          >
            🎲 Nova Pergunta
          </button>
        </div>
      </div>
    </div>
  )
}