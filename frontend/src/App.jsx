import { useState, useEffect } from 'react'

function App() {
  // Variáveis do formulário e da lista
  const [cachorros, setCachorros] = useState([])
  const [nome, setNome] = useState('')
  const [raca, setRaca] = useState('')
  const [idade, setIdade] = useState('')
  const [nomeDono, setNomeDono] = useState('')

  // NOVA VARIÁVEL: Guarda o texto digitado na barra de pesquisa
  const [busca, setBusca] = useState('')

  const carregarCachorros = async () => {
    const resposta = await fetch('http://127.0.0.1:8000/cachorros/')
    const dados = await resposta.json()
    setCachorros(dados)
  }

  useEffect(() => {
    carregarCachorros()
  }, [])

  const salvarCachorro = async (e) => {
    e.preventDefault()
    
    const novoCachorro = {
      nome: nome,
      raca: raca,
      idade: parseInt(idade),
      nome_dono: nomeDono
    }

    await fetch('http://127.0.0.1:8000/cachorros/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoCachorro)
    })

    setNome('')
    setRaca('')
    setIdade('')
    setNomeDono('')
    carregarCachorros()
  }

  // NOVA LÓGICA: Cria uma lista filtrada baseada no que foi digitado na busca
  const cachorrosFiltrados = cachorros.filter((dog) =>
    dog.nome.toLowerCase().includes(busca.toLowerCase()) || 
    dog.raca.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50' }}>🐾 Clínica Veterinária</h1>
      
      {/* Formulário de Cadastro */}
      <div style={{ marginBottom: '40px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h2>Cadastrar Paciente</h2>
        <form onSubmit={salvarCachorro} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="Nome do Pet" value={nome} onChange={(e) => setNome(e.target.value)} required style={{ padding: '8px' }} />
          <input placeholder="Raça" value={raca} onChange={(e) => setRaca(e.target.value)} required style={{ padding: '8px' }} />
          <input type="number" placeholder="Idade" value={idade} onChange={(e) => setIdade(e.target.value)} required style={{ padding: '8px' }} />
          <input placeholder="Nome do Dono" value={nomeDono} onChange={(e) => setNomeDono(e.target.value)} required style={{ padding: '8px' }} />
          
          <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            Salvar Cachorro
          </button>
        </form>
      </div>

      {/* NOVA SEÇÃO: Barra de Busca */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Pacientes Cadastrados</h2>
        <input 
          type="text" 
          placeholder="🔍 Buscar paciente por nome ou raça..." 
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' }}
        />
      </div>

      {/* Lista de Pacientes (Agora mapeando a lista filtrada) */}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {cachorrosFiltrados.map((dog) => (
          <li key={dog.id} style={{ marginBottom: '10px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <strong style={{ fontSize: '18px', color: '#2980b9' }}>{dog.nome}</strong> ({dog.raca}) - {dog.idade} anos <br/>
            <small>Dono(a): {dog.nome_dono}</small>
          </li>
        ))}

        {/* Mensagem exibida caso a busca não encontre nenhum cachorro */}
        {cachorrosFiltrados.length === 0 && (
          <p style={{ textAlign: 'center', color: '#7f8c8d', fontStyle: 'italic', marginTop: '20px' }}>
            Nenhum paciente encontrado.
          </p>
        )}
      </ul>
    </div>
  )
}

export default App