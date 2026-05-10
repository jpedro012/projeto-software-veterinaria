from pydantic import BaseModel

# Base com os dados que vamos receber do Front-end
class CachorroBase(BaseModel):
    nome: str
    raca: str
    idade: int
    nome_dono: str

# Schema para criar (igual a base por enquanto)
class CachorroCreate(CachorroBase):
    pass

# Schema para responder (inclui o ID gerado pelo Banco de Dados)
class CachorroResponse(CachorroBase):
    id: int

    class Config:
        from_attributes = True