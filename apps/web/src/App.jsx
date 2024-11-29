import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nome: '',
    sobreNome: '',
    email: '',
    endereco: {
      estado: '',
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
      codigoPostal: '',
      informacoesAdicionais: ''
    },
    telefones: [{
      ddd: '',
      numero: ''
    }]
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState('');
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:32832/clientes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      const data = await response.json();
      setUsers(data);
      setError('');
    } catch (error) {
      setError(`Erro ao carregar usuários: ${error.message}`);
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      telefones: prev.telefones.map((phone, i) => 
        i === index ? { ...phone, [field]: value } : phone
      )
    }));
  };

  const addPhone = () => {
    setForm(prev => ({
      ...prev,
      telefones: [...prev.telefones, { ddd: '', numero: '' }]
    }));
  };

  const removePhone = (index) => {
    setForm(prev => ({
      ...prev,
      telefones: prev.telefones.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isEditMode 
        ? 'http://localhost:32832/cliente/atualizar'
        : 'http://localhost:32832/cliente/cadastrar';
      
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      await fetchUsers();
      resetForm();
      setError('');
    } catch (error) {
      setError(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} usuário: ${error.message}`);
    }
  };

  const handleDelete = async (user) => {
    try {
      const response = await fetch('http://localhost:32832/cliente/excluir', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(user)
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      await fetchUsers();
      setError('');
    } catch (error) {
      setError(`Erro ao excluir usuário: ${error.message}`);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      nome: '',
      sobreNome: '',
      email: '',
      endereco: {
        estado: '',
        cidade: '',
        bairro: '',
        rua: '',
        numero: '',
        codigoPostal: '',
        informacoesAdicionais: ''
      },
      telefones: [{
        ddd: '',
        numero: ''
      }]
    });
    setIsEditMode(false);
    setIsAddressExpanded(false);
  };
  
  const handleEdit = (user) => {
    setForm(user);
    setIsEditMode(true);
    setIsAddressExpanded(true);
  };
  
  return (
    <div className="px-4 py-12 min-h-screen bg-gray-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-4xl font-bold text-center text-gray-900">Gerenciamento de Usuários</h1>
        
        {error && (
          <div className="p-4 mb-8 text-red-700 bg-red-100 rounded-md border-l-4 border-red-500 shadow-md" role="alert">
            <p className="font-bold">Erro</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="overflow-hidden mb-8 bg-white rounded-lg shadow-xl">
          <div className="px-6 py-8">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">{isEditMode ? 'Editar Usuário' : 'Criar Novo Usuário'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Sobrenome</label>
                  <input
                    type="text"
                    name="sobreNome"
                    value={form.sobreNome}
                    onChange={handleInputChange}
                    className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email || ''}
                  onChange={handleInputChange}
                  className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setIsAddressExpanded(!isAddressExpanded)}
                  className="flex items-center font-medium text-blue-600 hover:text-blue-800"
                >
                  {isAddressExpanded ? '▼ Ocultar Endereço' : '► Adicionar Endereço'}
                </button>

                {isAddressExpanded && (
                  <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Estado</label>
                      <input
                        type="text"
                        name="endereco.estado"
                        value={form.endereco.estado}
                        onChange={handleInputChange}
                        className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Cidade</label>
                      <input
                        type="text"
                        name="endereco.cidade"
                        value={form.endereco.cidade}
                        onChange={handleInputChange}
                        className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Bairro</label>
                      <input
                        type="text"
                        name="endereco.bairro"
                        value={form.endereco.bairro}
                        onChange={handleInputChange}
                        className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Rua</label>
                      <input
                        type="text"
                        name="endereco.rua"
                        value={form.endereco.rua}
                        onChange={handleInputChange}
                        className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Número</label>
                      <input
                        type="text"
                        name="endereco.numero"
                        value={form.endereco.numero}
                        onChange={handleInputChange}
                        className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">CEP</label>
                      <input
                        type="text"
                        name="endereco.codigoPostal"
                        value={form.endereco.codigoPostal}
                        onChange={handleInputChange}
                        className="px-3 py-2 w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Telefones</label>
                  <button
                    type="button"
                    onClick={addPhone}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    + Adicionar telefone
                  </button>
                </div>
                {form.telefones.map((phone, index) => (
                  <div key={index} className="flex gap-4 mb-2">
                    <input
                      type="text"
                      placeholder="DDD"
                      value={phone.ddd}
                      onChange={(e) => handlePhoneChange(index, 'ddd', e.target.value)}
                      className="px-3 py-2 w-20 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Número"
                      value={phone.numero}
                      onChange={(e) => handlePhoneChange(index, 'numero', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removePhone(index)}
                        className="font-medium text-red-600 hover:text-red-800"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 font-bold text-white bg-blue-600 rounded-md transition duration-300 ease-in-out hover:bg-blue-700"
                >
                  {isEditMode ? 'Atualizar Usuário' : 'Criar Usuário'}
                </button>
                {isEditMode && (
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 font-bold text-white bg-gray-600 rounded-md transition duration-300 ease-in-out hover:bg-gray-700"
                  >
                    Cancelar Edição
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Lista de Usuários</h2>
          {users.map(user => (
            <div key={user.id} className="overflow-hidden bg-white rounded-lg shadow-lg">
              <div className="px-6 py-4">
                <div className="flex flex-col justify-between items-start md:flex-row md:items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {user.nome} {user.sobreNome}
                    </h3>
                    {user.email && <p className="mt-1 text-sm text-gray-600">{user.email}</p>}
                    
                    {user.endereco && (
                      <p className="mt-1 text-sm text-gray-600">
                        {`${user.endereco.rua}, ${user.endereco.numero} - ${user.endereco.bairro}, ${user.endereco.cidade}/${user.endereco.estado}`}
                      </p>
                    )}
                    
                    {user.telefones && user.telefones.length > 0 && (
                      <p className="mt-1 text-sm text-gray-600">
                        {user.telefones.map(tel => `(${tel.ddd}) ${tel.numero}`).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="px-4 py-2 font-bold text-white bg-yellow-500 rounded-md transition duration-300 ease-in-out hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(user)}
                      className="px-4 py-2 font-bold text-white bg-red-600 rounded-md transition duration-300 ease-in-out hover:bg-red-700"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

