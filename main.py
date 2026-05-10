from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware # IMPORT NOVO
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models
import schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="API Veterinária")

# BLOCO NOVO: Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permite que qualquer front-end acesse a API
    allow_credentials=True,
    allow_methods=["*"], # Permite GET, POST, PUT, DELETE
    allow_headers=["*"],
)

# ... (aqui para baixo continuam as funções get_db, home, criar_cachorro, etc)

# Função para abrir e fechar a conexão com o banco em cada requisição
def get_db():
    db = SessionLocal() # Faltou essa linha aqui!
    try:
        yield db
    finally:
        db.close()
        
@app.get("/")
def home():
    return {"mensagem": "Bem-vindo ao Sistema Veterinário!"}

# 1. Rota para CADASTRAR um cachorro (POST)
@app.post("/cachorros/", response_model=schemas.CachorroResponse)
def criar_cachorro(cachorro: schemas.CachorroCreate, db: Session = Depends(get_db)):
    # Transforma os dados do schema em um modelo do banco
    novo_cachorro = models.Cachorro(**cachorro.model_dump())
    db.add(novo_cachorro) # Adiciona no banco
    db.commit()           # Salva as alterações
    db.refresh(novo_cachorro) # Atualiza para pegar o ID gerado
    return novo_cachorro

# 2. Rota para LISTAR os cachorros (GET)
@app.get("/cachorros/", response_model=list[schemas.CachorroResponse])
def listar_cachorros(db: Session = Depends(get_db)):
    cachorros = db.query(models.Cachorro).all()
    return cachorros