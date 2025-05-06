
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductos, createProducto } from '../api/api';
import ProductoCard from '../components/ProductoCard';
import { toast } from 'sonner';

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
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showForm ? 'Cancelar' : 'Agregar Producto'}
        </motion.button>
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
      ) : (
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
      )}
    </motion.div>
  );
};

export default ProductosPage;
