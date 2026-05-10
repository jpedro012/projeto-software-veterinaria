from sqlalchemy import Column, Integer, String
from database import Base

class Cachorro(Base):
    __tablename__ = "cachorros"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    raca = Column(String)
    idade = Column(Integer)
    nome_dono = Column(String)