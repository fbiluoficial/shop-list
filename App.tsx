import React, { useState, useEffect } from 'react';

interface Item {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState<string>('');
  const [editItemPrice, setEditItemPrice] = useState<string>('');

  useEffect(() => {
    const savedItems = localStorage.getItem('shoppingList');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (newItem && newPrice) {
      const newItemObj: Item = {
        id: Date.now().toString(),
        name: newItem,
        price: parseFloat(newPrice),
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      };
      setItems([...items, newItemObj]);
      setNewItem('');
      setNewPrice('');
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const startEdit = (item: Item) => {
    setEditItemId(item.id);
    setEditItemName(item.name);
    setEditItemPrice(item.price.toString());
  };

  const saveEdit = () => {
    if (editItemId && editItemName && editItemPrice) {
      setItems(items.map(item =>
        item.id === editItemId
          ? { ...item, name: editItemName, price: parseFloat(editItemPrice), updatedAt: new Date().toLocaleString() }
          : item
      ));
      setEditItemId(null);
      setEditItemName('');
      setEditItemPrice('');
    }
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min- ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lista de Compras</h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Nome do item"
              className={`flex-1 p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
            />
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Preço"
              className={`w-24 p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
            />
            <button
              onClick={addItem}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Adicionar
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar..."
              className={`w-full p-2 pl-10 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}
            />
            <svg
              className="absolute left-3 top-3 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {editItemId === item.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editItemName}
                    onChange={(e) => setEditItemName(e.target.value)}
                    className={`flex-1 p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  />
                  <input
                    type="number"
                    value={editItemPrice}
                    onChange={(e) => setEditItemPrice(e.target.value)}
                    className={`w-24 p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  />
                  <button
                    onClick={saveEdit}
                    className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">R$ {item.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">Criado em: {item.createdAt}</p>
                    <p className="text-xs text-gray-400">Última edição: {item.updatedAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-blue-500 text-white">
          <p className="text-lg font-semibold">Total: R$ {total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default App;