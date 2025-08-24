'use client'

import { useState, useEffect } from 'react'
import QuizForm from './components/QuizForm'
import QuizDisplay from './components/QuizDisplay'

export default function Home() {
  const [quizData, setQuizData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [savedFormData, setSavedFormData] = useState({ content: '', difficulty: 1 })

  // Carregar dados salvos do localStorage na inicialização
  useEffect(() => {
    const saved = localStorage.getItem('quizFormData')
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        setSavedFormData(parsedData)
      } catch (e) {
        console.warn('Erro ao carregar dados salvos:', e)
      }
    }
  }, [])

  // util: limpa fences de código e espaços
  function cleanCodeFences(s) {
    if (!s || typeof s !== 'string') return s
    let t = s.trim()

    // remover fence tripla com linguagem, ex: ```json\n...\n```
    if (t.startsWith('```')) {
      // remove primeiro ```... e último ```
      // tirar a primeira linha se for ```json ou ```json\n
      // ex: ```json\n{...}\n```
      const withoutFirst = t.replace(/^```[^\n]*\n?/, '')
      t = withoutFirst.replace(/```$/, '').trim()
    }

    // remover single-line fenced (ex: `{"a":1}`)
    if (t.startsWith('`') && t.endsWith('`')) {
      t = t.slice(1, -1).trim()
    }

    return t
  }

  // util fallback: extrair primeiro JSON entre chaves {}
  function extractFirstJsonObject(s) {
    if (!s || typeof s !== 'string') return null
    const start = s.indexOf('{')
    let brace = 0
    if (start === -1) return null
    for (let i = start; i < s.length; i++) {
      if (s[i] === '{') brace++
      else if (s[i] === '}') brace--
      if (brace === 0) {
        const candidate = s.slice(start, i + 1)
        try {
          return JSON.parse(candidate)
        } catch (e) {
          return null
        }
      }
    }
    return null
  }

  const handleGenerateQuiz = async (content, difficulty) => {
    // Salvar os dados no localStorage
    const formData = { content, difficulty }
    localStorage.setItem('quizFormData', JSON.stringify(formData))
    setSavedFormData(formData)

    setLoading(true)
    try {
      console.log('Enviando dados:', { content, difficulty })

      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, difficulty }),
      })

      console.log('Status da resposta:', response.status)

      const textResponse = await response.text()
      console.log('Resposta raw:', textResponse)

      if (!response.ok) {
        console.log('Erro detalhado:', textResponse)
        throw new Error(`Erro ${response.status}: ${textResponse}`)
      }

      // 1) limpar fences (```json ... ```), crases, etc
      const cleaned = cleanCodeFences(textResponse)
      console.log('Resposta limpa:', cleaned)

      // 2) tentar parse direto
      let parsed = null
      try {
        parsed = JSON.parse(cleaned)
        console.log('JSON parseado com sucesso (limpo):', parsed)
      } catch (parseError) {
        console.warn('Falha ao parsear JSON limpo:', parseError)
        // 3) fallback: se o texto for um objeto maior (ex: API do Gemini), tentar localizar o JSON dentro do textResponse
        // Se o retorno for o objeto do Gemini, o JSON esperado pode estar em candidates[0].content.parts[0].text
        let geminiObj = null
        try {
          geminiObj = JSON.parse(textResponse)
        } catch (e) {
          geminiObj = null
        }

        if (geminiObj && geminiObj.candidates && geminiObj.candidates[0] && geminiObj.candidates[0].content) {
          // extrair o campo text e tentar limpar/fazer parse dele
          const inner = String(geminiObj.candidates[0].content.parts[0].text)
          const cleanedInner = cleanCodeFences(inner)
          try {
            parsed = JSON.parse(cleanedInner)
            console.log('JSON parseado com sucesso (inner):', parsed)
          } catch (innerError) {
            console.warn('Falha ao parsear inner JSON:', innerError)
            // tentar extrair primeiro objeto JSON entre chaves
            parsed = extractFirstJsonObject(cleanedInner)
            console.log('Tentativa de extrair JSON do inner resultou em:', parsed)
          }
        } else {
          // tentar extrair JSON direto do cleaned usando busca por { ... }
          parsed = extractFirstJsonObject(cleaned)
          console.log('Tentativa de extrair JSON direto resultou em:', parsed)
        }
      }

      if (!parsed) {
        throw new Error('O modelo não retornou um JSON válido após limpeza. Verifique o prompt (não inclua fences ``` no JSON).')
      }

      // parsed deve ser o objeto final no formato:
      // { pergunta, alternativas: {a,b,c,d}, resposta_correta, explicacao }
      let processedData = null

      // Se o parsed for o objeto Gemini completo, extrair inner
      if (parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content) {
        const innerText = String(parsed.candidates[0].content.parts[0].text)
        const cleanedInner = cleanCodeFences(innerText)
        try {
          processedData = JSON.parse(cleanedInner)
        } catch (e) {
          processedData = extractFirstJsonObject(cleanedInner)
        }
      } else if (parsed.pergunta && parsed.alternativas) {
        processedData = parsed
      } else {
        // tente fallback: se parsed contém string com o JSON dentro das propriedades
        processedData = parsed
      }

      if (!processedData || !processedData.pergunta || !processedData.alternativas) {
        throw new Error('Dados incompletos após parsing. Veja console para detalhes.')
      }

      setQuizData(processedData)
    } catch (error) {
      console.error('Erro completo:', error)
      alert('Erro ao gerar pergunta: ' + error.message)
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
          <QuizForm 
            onSubmit={handleGenerateQuiz} 
            loading={loading} 
            initialData={savedFormData}
          />
        ) : (
          <QuizDisplay quizData={quizData} onNewQuiz={handleNewQuiz} />
        )}
      </div>
    </div>
  )
}