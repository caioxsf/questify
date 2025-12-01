import os
import httpx
import asyncio
import json

from fastapi import HTTPException


async def generate_question(content: str, difficult: int):
    url = os.environ.get("URL_API")
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {os.environ.get("ROUTELLM_API_KEY")}',
    }
    stream = False
    payload = {
        "model": os.environ.get("LLM_MODEL"),
        "messages": [
            {
                "role": "user",
                "content": f"""
                            Você é um gerador de perguntas para quiz.

                            TEMA: {content}
                            DIFICULDADE: {difficult}

                            Níveis de dificuldade:
                            - 1 = Fácil (questão simples e direta)
                            - 2 = Médio (requer conhecimento intermediário)
                            - 3 = Difícil (requer conhecimento avançado)

                            Gere UMA pergunta de múltipla escolha com 4 alternativas plausíveis.

                            REGRAS:
                            - Pergunta clara e objetiva em português brasileiro
                            - 4 alternativas plausíveis (a, b, c, d)
                            - Apenas UMA alternativa correta
                            - Varie a posição da resposta correta (não use sempre "a")
                            - Adeque a dificuldade ao nível solicitado
                            - Inclua uma explicação breve da resposta

                            Retorne APENAS o JSON abaixo, sem texto adicional, sem markdown, sem blocos de código:

                            {{"pergunta": "Sua pergunta aqui?", "alternativas": {{"a": "Opção A", "b": "Opção B", "c": "Opção C", "d": "Opção D"}}, "resposta_correta": "a", "explicacao": "Explicação da resposta"}}
                            """
            }
        ],
        "stream": stream,
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            
            content_text = result["choices"][0]["message"]["content"]
            
            question_json = json.loads(content_text)
            
            return question_json
            
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Erro ao parsear JSON da resposta: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na API: {str(e)}")