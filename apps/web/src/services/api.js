// src/services/api.js
const API_URL = 'http://localhost:5000/api';

export const clienteService = {
  buscarTodos: async () => {
    const response = await fetch(`${API_URL}/clientes`);
    if (!response.ok) throw new Error('Erro ao buscar clientes');
    return response.json();
  },

  criar: async (cliente) => {
    const response = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
    if (!response.ok) throw new Error('Erro ao criar cliente');
    return response.json();
  },

  atualizar: async (id, cliente) => {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
    if (!response.ok) throw new Error('Erro ao atualizar cliente');
    return response.json();
  },

  remover: async (id) => {
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao remover cliente');
    return response.json();
  }
};

export const servicoService = {
  buscarTodos: async () => {
    const response = await fetch(`${API_URL}/servicos`);
    if (!response.ok) throw new Error('Erro ao buscar serviços');
    return response.json();
  },

  criar: async (servico) => {
    const response = await fetch(`${API_URL}/servicos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servico)
    });
    if (!response.ok) throw new Error('Erro ao criar serviço');
    return response.json();
  },

  atualizar: async (id, servico) => {
    const response = await fetch(`${API_URL}/servicos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(servico)
    });
    if (!response.ok) throw new Error('Erro ao atualizar serviço');
    return response.json();
  },

  remover: async (id) => {
    const response = await fetch(`${API_URL}/servicos/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Erro ao remover serviço');
    return response.json();
  }
};

export const consumoService = {
  criar: async (consumo) => {
    const response = await fetch(`${API_URL}/consumos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consumo)
    });
    if (!response.ok) throw new Error('Erro ao registrar consumo');
    return response.json();
  }
};

export const relatorioService = {
  topClientesQuantidade: async () => {
    const response = await fetch(`${API_URL}/relatorios/top-clientes-quantidade`);
    if (!response.ok) throw new Error('Erro ao buscar top clientes por quantidade');
    return response.json();
  },

  clientesPorGenero: async () => {
    const response = await fetch(`${API_URL}/relatorios/clientes-por-genero`);
    if (!response.ok) throw new Error('Erro ao buscar clientes por gênero');
    return response.json();
  },

  servicosMaisConsumidos: async () => {
    const response = await fetch(`${API_URL}/relatorios/servicos-mais-consumidos`);
    if (!response.ok) throw new Error('Erro ao buscar serviços mais consumidos');
    return response.json();
  },

  servicosPorGenero: async () => {
    const response = await fetch(`${API_URL}/relatorios/servicos-por-genero`);
    if (!response.ok) throw new Error('Erro ao buscar serviços por gênero');
    return response.json();
  },

  clientesMenorConsumo: async () => {
    const response = await fetch(`${API_URL}/relatorios/clientes-menor-consumo`);
    if (!response.ok) throw new Error('Erro ao buscar clientes com menor consumo');
    return response.json();
  },

  topClientesValor: async () => {
    const response = await fetch(`${API_URL}/relatorios/top-clientes-valor`);
    if (!response.ok) throw new Error('Erro ao buscar top clientes por valor');
    return response.json();
  }
};