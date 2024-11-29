import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [clients, setClients] = useState([])
  const [services, setServices] = useState([])
  const [consumptions, setConsumptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mostConsumingClients, setMostConsumingClients] = useState([])
  const [leastConsumingClients, setLeastConsumingClients] = useState([])
  const [mostConsumedServices, setMostConsumedServices] = useState([])
  const [leastConsumedServices, setLeastConsumedServices] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [
          clientsRes,
          servicesRes,
          mostConsumingClientsRes,
          leastConsumingClientsRes,
          mostConsumedServicesRes,
          leastConsumedServicesRes
        ] = await Promise.all([
          axios.get('http://localhost:5000/api/clientes'),
          axios.get('http://localhost:5000/api/servicos'),
          axios.post('http://localhost:5000/api/consumos')
          // axios.get('http://localhost:5000/api/relatorios/clientes-mais-consumiram'),
          // axios.get('http://localhost:5000/api/relatorios/clientes-menos-consumiram'),
          // axios.get('http://localhost:5000/api/relatorios/servicos-mais-consumidos'),
          // axios.get('http://localhost:5000/api/relatorios/servicos-menos-consumidos')
        ]);

        setClients(clientsRes.data);
        setServices(servicesRes.data);
        // setMostConsumingClients(mostConsumingClientsRes.data);
        // setLeastConsumingClients(leastConsumingClientsRes.data);
        // setMostConsumedServices(mostConsumedServicesRes.data);
        // setLeastConsumedServices(leastConsumedServicesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error loading data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addClient = async (newClient) => {
    try {
      const response = await axios.post('/api/clientes', newClient)
      setClients(prev => Array.isArray(prev) ? [...prev, response.data] : [response.data])
    } catch (error) {
      console.error('Error adding client:', error)
      alert('Error adding client. Please try again.')
    }
  }

  const addService = async (newService) => {
    try {
      const response = await axios.post('/api/servicos', newService)
      setServices(prev => Array.isArray(prev) ? [...prev, response.data] : [response.data])
    } catch (error) {
      console.error('Error adding service:', error)
      alert('Error adding service. Please try again.')
    }
  }

  const addConsumption = async (newConsumption) => {
    try {
      const response = await axios.post('http://localhost:5000/api/consumos', {
        clienteId: parseInt(newConsumption.clienteId),
        servicoId: parseInt(newConsumption.servicoId)
      });
      setConsumptions(prev => [...prev, response.data]);
      // Recarregar os relatórios após adicionar um novo consumo
      fetchData();
    } catch (error) {
      console.error('Error recording consumption:', error);
      alert('Error recording consumption. Please try again.');
    }
  }

  // // Display most consuming clients
  // {mostConsumingClients.map((client, index) => (
  //   <div key={client.id}>
  //     {index + 1}. {client.name} - {client.totalConsumptions} consumptions
  //   </div>
  // ))}

  // // Display least consuming clients
  // {leastConsumingClients.map((client, index) => (
  //   <div key={client.id}>
  //     {index + 1}. {client.name} - {client.totalConsumptions} consumptions
  //   </div>
  // ))}

  // // Display most consumed services
  // {mostConsumedServices.map((service, index) => (
  //   <div key={service.id}>
  //     {index + 1}. {service.name} - {service.totalConsumptions} consumptions
  //   </div>
  // ))}

  // // Display least consumed services
  // {leastConsumedServices.map((service, index) => (
  //   <div key={service.id}>
  //     {index + 1}. {service.name} - {service.totalConsumptions} consumptions
  //   </div>
  // ))}

  if (loading) {
    return <div>Carregando dados...</div>
  }

  if (error) {
    return <div>Erro: {error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1>Empresa 'X'</h1>

      {/* Formulário de cliente */}
      <h2>Cadastro de Cliente</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addClient({
            nome: e.target.name.value,
            socialName: e.target.socialName.value,
            rg: e.target.rg.value,
            rgIssueDate: e.target.rgIssueDate.value,
            cpf: e.target.cpf.value,
            cpfIssueDate: e.target.cpfIssueDate.value,
            telefone: e.target.phone.value
          })
          e.target.reset()
        }}
      >
        <label>
          Nome:
          <input type="text" name="name" required />
        </label>
        <label>
          Nome social:
          <input type="text" name="socialName" />
        </label>
        <label>
          RG:
          <input type="text" name="rg" required />
          Data de emissão:
          <input type="date" name="rgIssueDate" required />
        </label>
        <label>
          CPF:
          <input type="text" name="cpf" required />
          Data de emissão:
          <input type="date" name="cpfIssueDate" required />
        </label>
        <label>
          Telefone:
          <input type="tel" name="phone" required />
        </label>
        <button type="submit">Adicionar Cliente</button>
      </form>

      {/* Formulário de serviço */}
      <h2>Cadastro de Serviço</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addService({
            nome: e.target.name.value,
            valor: parseFloat(e.target.value.value)
          })
          e.target.reset()
        }}
      >
        <label>
          Nome do Serviço:
          <input type="text" name="name" required />
        </label>
        <label>
          Valor do Serviço:
          <input type="number" name="value" required step="0.01" min="0" />
        </label>
        <button type="submit">Adicionar Serviço</button>
      </form>

      Área de Consumo
      <h2>Registrar Consumo</h2>
      {clients.length === 0 || services.length === 0 ? (
        <p>É necessário cadastrar clientes e serviços antes de registrar consumos.</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addConsumption({
              clienteId: e.target.clientName.value,
              servicoId: e.target.serviceName.value,
              performedBy: e.target.performedBy.value
            })
            e.target.reset()
          }}
        >
          <label>
            Cliente:
            <select name="clientName" required>
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Serviço:
            <select name="serviceName" required>
              <option value="">Selecione um serviço</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.nome}
                </option>
              ))}
            </select>
          </label>
          <label>
            Realizado por:
            <input type="text" name="performedBy" required />
          </label>
          <button type="submit">Registrar Consumo</button>
        </form>
      )}

      {/* Área de Clientes Cadastrados */}
      <h2>Clientes Cadastrados</h2>
      {clients.length === 0 ? (
        <p>Nenhum cliente cadastrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Nome Social</th>
              <th>RG</th>
              <th>Data de Emissão RG</th>
              <th>CPF</th>
              <th>Data de Emissão CPF</th>
              <th>Telefone</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.nome}</td>
                <td>{client.socialName}</td>
                <td>{client.rg}</td>
                <td>{client.rgIssueDate}</td>
                <td>{client.cpf}</td>
                <td>{client.cpfIssueDate}</td>
                <td>{client.telefone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Área de Serviços Cadastrados */}
      <h2>Serviços Cadastrados</h2>
      {services.length === 0 ? (
        <p>Nenhum serviço cadastrado.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nome do Serviço</th>
              <th>Valor do Serviço</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.nome}</td>
                <td>{service.valor.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Área de Análise */}
      {consumptions.length > 0 && (
        <div>
          <h2>Análise</h2>
          <div>
            <h3>Serviços mais consumidos:</h3>
            <ul>
              {getMostConsumedServices().map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Serviços menos consumidos:</h3>
            <ul>
              {getLeastConsumedServices().map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Clientes que mais consumiram:</h3>
            <ul>
              {getMostConsumingClients().map((client, index) => (
                <li key={index}>{client}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Clientes que menos consumiram:</h3>
            <ul>
              {getLeastConsumingClients().map((client, index) => (
                <li key={index}>{client}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default App