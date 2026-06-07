import { useState, useEffect } from 'react'

function App() {
  const [cachorros, setCachorros] = useState([])
  const [nome, setNome] = useState('')
  const [raca, setRaca] = useState('')
  const [idade, setIdade] = useState('')
  const [nomeDono, setNomeDono] = useState('')
  
  // NOVOS ESTADOS PARA O LAUDO
  const [problema, setProblema] = useState('')
  const [tratamento, setTratamento] = useState('')
  const [dataEntrada, setDataEntrada] = useState('')

  const [busca, setBusca] = useState('')
  
  // NOVO ESTADO: Controla qual paciente está com o laudo aberto na tela
  const [laudoAberto, setLaudoAberto] = useState(null)

  const carregarCachorros = async () => {
    const resposta = await fetch('http://127.0.0.1:8000/cachorros/')
    const dados = await resposta.json()
    setCachorros(dados)
  }

  const darAlta = async (id) => {
    if (window.confirm("Tem certeza que deseja dar alta para este paciente?")) {
      try {
        await fetch(`http://127.0.0.1:8000/cachorros/${id}`, { method: 'DELETE' });
        carregarCachorros(); 
      } catch (error) {
        console.error("Erro ao dar alta no paciente:", error);
      }
    }
  };

  useEffect(() => {
    carregarCachorros()
  }, [])

  const salvarCachorro = async (e) => {
    e.preventDefault()
    
    const novoCachorro = {
      nome: nome,
      raca: raca,
      idade: parseInt(idade),
      nome_dono: nomeDono,
      problema: problema,
      tratamento: tratamento,
      data_entrada: dataEntrada
    }

    await fetch('http://127.0.0.1:8000/cachorros/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoCachorro)
    })

    // Limpa o formulário após salvar
    setNome('')
    setRaca('')
    setIdade('')
    setNomeDono('')
    setProblema('')
    setTratamento('')
    setDataEntrada('')
    carregarCachorros()
  }

  const cachorrosFiltrados = cachorros.filter((dog) =>
    dog.nome.toLowerCase().includes(busca.toLowerCase()) || 
    dog.raca.toLowerCase().includes(busca.toLowerCase())
  )

  // FUNÇÃO: Abre e fecha a caixinha do laudo
  const toggleLaudo = (id) => {
    if (laudoAberto === id) {
      setLaudoAberto(null) // Fecha se já estiver aberto
    } else {
      setLaudoAberto(id) // Abre o laudo do cachorro clicado
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '650px', margin: '0 auto' }}>
      <h1 style={{ color: '#2c3e50', textAlign: 'center' }}>🐾 Clínica Veterinária</h1>
      
      {/* Formulário de Cadastro */}
      <div style={{ marginBottom: '40px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h2>Cadastrar Paciente</h2>
        <form onSubmit={salvarCachorro} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input placeholder="Nome do Pet" value={nome} onChange={(e) => setNome(e.target.value)} required style={{ padding: '8px', flex: 1 }} />
            <input placeholder="Raça" value={raca} onChange={(e) => setRaca(e.target.value)} required style={{ padding: '8px', flex: 1 }} />
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" placeholder="Idade" value={idade} onChange={(e) => setIdade(e.target.value)} required style={{ padding: '8px', width: '80px' }} />
            <input placeholder="Nome do Dono" value={nomeDono} onChange={(e) => setNomeDono(e.target.value)} required style={{ padding: '8px', flex: 1 }} />
            <input type="date" title="Data de Entrada" value={dataEntrada} onChange={(e) => setDataEntrada(e.target.value)} required style={{ padding: '8px' }} />
          </div>

          <input placeholder="Qual o problema do paciente?" value={problema} onChange={(e) => setProblema(e.target.value)} required style={{ padding: '8px' }} />
          <input placeholder="Qual o tratamento prescrito?" value={tratamento} onChange={(e) => setTratamento(e.target.value)} required style={{ padding: '8px' }} />

          <button type="submit" style={{ padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '5px' }}>
            Salvar Ficha do Paciente
          </button>
        </form>
      </div>

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

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {cachorrosFiltrados.map((dog) => (
          <li key={dog.id} style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '18px', color: '#2980b9' }}>{dog.nome}</strong> ({dog.raca}) - {dog.idade} anos <br/>
                <small style={{ color: '#7f8c8d' }}>Dono(a): {dog.nome_dono}</small>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* BOTÃO DE VER LAUDO */}
                <button 
                  onClick={() => toggleLaudo(dog.id)} 
                  style={{ backgroundColor: laudoAberto === dog.id ? '#95a5a6' : '#3498db', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {laudoAberto === dog.id ? 'Fechar Laudo' : 'Ver Laudo'}
                </button>

                <button 
                  onClick={() => darAlta(dog.id)} 
                  style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Dar Alta
                </button>
              </div>
            </div>

            {/* ÁREA DO LAUDO (Só aparece se você clicou em "Ver Laudo" deste cachorro) */}
            {laudoAberto === dog.id && (
              <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#fffbe6', borderLeft: '4px solid #f1c40f', borderRadius: '0 4px 4px 0' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#d35400', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  📄 Laudo Médico
                </h4>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Entrada:</strong> {new Date(dog.data_entrada).toLocaleDateString('pt-BR')}</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Problema:</strong> {dog.problema}</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Tratamento:</strong> {dog.tratamento}</p>
              </div>
            )}

          </li>
        ))}

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