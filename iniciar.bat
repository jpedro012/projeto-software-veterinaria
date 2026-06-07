@echo off
echo =======================================
echo   Iniciando o Sistema da Veterinaria
echo =======================================

:: Inicia o Back-end em uma nova janela
echo Ligando o Back-end (Python FastAPI)...
start cmd /k "venv\Scripts\activate && uvicorn main:app --reload"

:: Espera 3 segundos para garantir que o back-end ligou primeiro
timeout /t 3 /nobreak > NUL

:: Inicia o Front-end em outra janela
echo Ligando o Front-end (React Vite)...
start cmd /k "cd frontend && npm run dev"

echo Tudo pronto! Pode minimizar esta janela.