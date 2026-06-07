from pydantic import BaseModel

class CachorroBase(BaseModel):
    nome: str
    raca: str
    idade: int
    nome_dono: str
    problema: str
    tratamento: str
    data_entrada: str

class CachorroCreate(CachorroBase):
    pass

class CachorroResponse(CachorroBase):
    id: int

    class Config:
        from_attributes = True