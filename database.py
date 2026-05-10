from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Cria um arquivo chamado veterinaria.db na sua pasta
SQLALCHEMY_DATABASE_URL = "sqlite:///./veterinaria.db"

# Configura o motor do banco de dados
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Cria a sessão (a "conversa" com o banco)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para criarmos as nossas tabelas depois
Base = declarative_base()