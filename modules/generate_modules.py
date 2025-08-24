import os
import httpx
import asyncio

from fastapi import HTTPException


url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

async def generate_question(content: str, difficult: int):
    headers = {
        'Content-Type': 'application/json',
        'X-goog-api-key': os.environ.get("GEMINI_API_KEY")
    }

    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"""
                                    Você é um gerador de perguntas para um jogo de quiz.

                                    TEMA: {content}
                                    DIFICULDADE: {difficult}

                                    DIFICULDADE 1 = Fácil (varie entre Fácil / Muito fácil / Extremo fácil)
                                    DIFICULDADE 2 = Médio (varie entre Médio / Muito médio / Extremo médio)
                                    DIFICULDADE 3 = Difícil (varie entre Difícil / Muito difícil / Extremo difícil)

                                    INSTRUÇÕES IMPORTANTES:
                                    1) Gere exatamente 15 perguntas semanticamente distintas sobre este tema e dificuldade. "Semanticamente distintas" significa que o enunciado não deve ser apenas uma pequena variação do mesmo texto — reescreva e mude o foco quando necessário.
                                    2) Para cada uma das 15 perguntas, gere 4 alternativas plausíveis (a,b,c,d) e marque apenas UMA alternativa correta.
                                    3) Distribua a posição da resposta correta entre as opções (não coloque sempre "a").
                                    4) EXIJA variação de formulação (sinônimos, diferentes estruturas de pergunta) para evitar repetições.
                                    5) NÃO inclua explicações nesse array de 15. Só pergunta e alternativas para o pool.
                                    6) Depois de gerar o pool de 15 perguntas, escolha uma delas aleatoriamente e retorne APENAS o objeto JSON da pergunta escolhida, no formato exato abaixo, sem texto adicional, sem quebras de linha no JSON e sem blocos de código:
                                    7) Não se esqueça de colocar a explicação da resposta.
                                    {{"pergunta": "Sua pergunta aqui?", "alternativas": {{"a": "Opção A", "b": "Opção B", "c": "Opção C", "d": "Opção D"}}, "resposta_correta": "a", "explicacao": "Explicação da resposta"}}

                                    REGRAS:
                                    - Se alguma das 15 perguntas for muito parecida com outra, reformule até que fiquem distintas.
                                    - Para nao repetir perguntas, gere 15 perguntas sobre esse tema com essa dificuldade e faça um sorteio e escolha uma entre essas 15.
                                    - A pergunta deve ser clara e objetiva
                                    - As 4 alternativas devem ser plausíveis
                                    - Apenas UMA alternativa está correta
                                    - A resposta_correta deve ser "a", "b", "c" ou "d"
                                    - Use português brasileiro
                                    - Adeque a dificuldade ao nível solicitado
                                    - NÃO inclua quebras de linha no JSON
                                    - NÃO adicione texto antes ou depois do JSON

                                    Retorne apenas o JSON acima .
                                    
                                    """
                    }
                ]
            }
        ]
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=data)
            response.raise_for_status()
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no Gemini: {str(e)}")