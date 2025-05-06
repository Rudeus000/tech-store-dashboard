import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductos, createProducto } from '../api/api';
import ProductoCard from '../components/ProductoCard';
import { toast } from 'sonner';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, ArrowUp, ArrowDown, Edit, Trash } from "lucide-react";

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: ''
  });
  const [errors, setErrors] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await getProductos();
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      toast.error('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = 'El nombre es requerido';
    if (!formData.precio || formData.precio <= 0) newErrors.precio = 'El precio debe ser mayor a 0';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'La cantidad debe ser igual o mayor a 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'nombre' ? value : value === '' ? '' : Number(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const response = await createProducto(formData);
      setProductos([...productos, response.data]);
      setFormData({ nombre: '', precio: '', stock: '' });
      setShowForm(false);
      toast.success('Producto agregado correctamente');
    } catch (error) {
      console.error('Error al crear producto:', error);
      toast.error('Error al agregar el producto');
    }
  };

  const handleUpdate = (updatedProducto) => {
    setProductos(productos.map(p => p.id === updatedProducto.id ? updatedProducto : p));
  };

  const handleDelete = (id) => {
    setProductos(productos.filter(p => p.id !== id));
  };

  // Sorting function for table view
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedProductos = React.useMemo(() => {
    if (!sortConfig.key) return productos;
    
    return [...productos].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [productos, sortConfig]);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0 }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  };

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="section-title text-3xl">Gestión de Productos</h1>
        <div className="flex gap-4">
          <div className="bg-white border border-gray-200 p-1 rounded-xl shadow-sm flex">
            <button 
              onClick={() => setViewMode('grid')} 
              className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-tech-blue to-tech-purple text-white' : 'text-gray-500'}`}
            >
              Cards
            </button>
            <button 
              onClick={() => setViewMode('table')} 
              className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-gradient-to-r from-tech-blue to-tech-purple text-white' : 'text-gray-500'}`}
            >
              Tabla
            </button>
          </div>
          <motion.button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showForm ? 'Cancelar' : (
              <span className="flex items-center gap-2">
                <Plus size={18} />
                Agregar Producto
              </span>
            )}
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
          >
            <h2 className="text-xl font-bold text-tech-gray-dark mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-gradient-to-b from-tech-blue to-tech-purple rounded-full"></span>
              Nuevo Producto
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Nombre del producto"
                  />
                  {errors.nombre && <p className="form-error">{errors.nombre}</p>}
                </div>
                
                <div>
                  <label className="form-label">Precio</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      step="0.01"
                      className="form-input pl-6"
                      placeholder="0.00"
                    />
                  </div>
                  {errors.precio && <p className="form-error">{errors.precio}</p>}
                </div>
                
                <div>
                  <label className="form-label">Cantidad en stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0"
                  />
                  {errors.stock && <p className="form-error">{errors.stock}</p>}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  type="submit"
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Agregar
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-tech-blue"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-tech-blue-light opacity-20"></div>
          </div>
        </div>
      ) : productos.length === 0 ? (
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-24 w-24 rounded-full bg-tech-blue-light/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-tech-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-tech-gray-dark text-xl mb-4">No hay productos registrados.</p>
            <motion.button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Agregar Producto
            </motion.button>
          </div>
        </motion.div>
      ) : viewMode === 'grid' ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {productos.map((producto) => (
            <ProductoCard 
              key={producto.id} 
              producto={producto} 
              onUpdate={handleUpdate}
              onDelete={handleDelete} 
            />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-gray-100">
                  <TableHead onClick={() => requestSort('nombre')} className="cursor-pointer hover:bg-gray-200 transition-colors">
                    <div className="flex items-center">
                      Nombre
                      {sortConfig.key === 'nombre' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => requestSort('precio')} className="cursor-pointer hover:bg-gray-200 transition-colors">
                    <div className="flex items-center">
                      Precio
                      {sortConfig.key === 'precio' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => requestSort('stock')} className="cursor-pointer hover:bg-gray-200 transition-colors">
                    <div className="flex items-center">
                      Stock
                      {sortConfig.key === 'stock' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {sortedProductos.map((producto) => (
                    <motion.tr
                      key={producto.id}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 24
                      }}
                      className="border-b hover:bg-blue-50 transition-colors"
                    >
                      <TableCell className="font-medium">{producto.nombre}</TableCell>
                      <TableCell className="font-semibold text-tech-blue-dark">
                        ${producto.precio.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            producto.stock > 10 ? 'bg-green-500' : 
                            producto.stock > 0 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}></div>
                          <span className={`${
                            producto.stock > 10 ? 'text-green-700' : 
                            producto.stock > 0 ? 'text-yellow-700' : 
                            'text-red-700'
                          }`}>
                            {producto.stock} unidades
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <motion.button
                          onClick={() => {
                            // Encuentra el card correspondiente y activa su modo de edición
                            // Aquí podríamos implementar un modal de edición o una funcionalidad específica
                            const card = document.getElementById(`producto-${producto.id}`);
                            if (card) {
                              const editButton = card.querySelector('.btn-secondary');
                              if (editButton) editButton.click();
                            }
                          }}
                          className="inline-flex items-center justify-center text-center h-8 w-8 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(producto.id)}
                          className="inline-flex items-center justify-center text-center h-8 w-8 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash size={16} />
                        </motion.button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductosPage;
