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

                            DIFICULDADE 1: Fácil
                            DIFICULDADE 2: Médio
                            DIFICULDADE 3: Difícil

                            TEMA: {content}
                            DIFICULDADE: {difficult}
                            
                            

                            Gere UMA pergunta sobre o tema escolhido seguindo EXATAMENTE este formato:

                            
                            "pergunta": "Sua pergunta aqui?";
                            
                            "alternativas": 
                            "a": "Primeira opção";
                            "b": "Segunda opção";
                            "c": "Terceira opção";
                            "d": "Quarta opção";
                            
                            "resposta_correta": "a";
                            "explicacao": "Breve explicação da resposta correta";
                            
                            Mas gere para mim sem a palavra "pergunta", "alternativas", "a,b,c e d", "resposta_correta" e "explicacao"
                            Separe também por " ; ", para eu conseguir fazer o split depois

                            REGRAS IMPORTANTES:
                            - A pergunta deve ser clara e objetiva
                            - As 4 alternativas devem ser plausíveis 
                            - Apenas UMA alternativa está correta
                            - A resposta_correta deve ser "a", "b", "c" ou "d"
                            - Sem texto adicional
                            - Use português brasileiro
                            - Adeque a dificuldade ao nível solicitado

                            TEMA: {content}
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