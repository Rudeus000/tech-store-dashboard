
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVentas, createVenta, getProductos } from '../api/api';
import VentaCard from '../components/VentaCard';
import { toast } from 'sonner';

const VentasPage = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    producto_id: '',
    cantidad: '',
    fecha_venta: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVentas();
    fetchProductos();
  }, []);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const response = await getVentas();
      setVentas(response.data);
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      toast.error('Error al cargar las ventas');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductos = async () => {
    try {
      const response = await getProductos();
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      toast.error('Error al cargar los productos');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.producto_id) newErrors.producto_id = 'El producto es requerido';
    if (!formData.cantidad || formData.cantidad <= 0) newErrors.cantidad = 'La cantidad debe ser mayor a 0';
    if (!formData.fecha_venta) newErrors.fecha_venta = 'La fecha es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'cantidad' || name === 'producto_id' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      // Añadir el nombre del producto al enviar la venta (para la visualización)
      const selectedProduct = productos.find(p => p.id === formData.producto_id);
      const ventaData = {
        ...formData,
        producto_nombre: selectedProduct?.nombre
      };
      
      const response = await createVenta(ventaData);
      setVentas([...ventas, response.data]);
      setFormData({
        producto_id: '',
        cantidad: '',
        fecha_venta: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      toast.success('Venta registrada correctamente');
    } catch (error) {
      console.error('Error al registrar venta:', error);
      toast.error('Error al registrar la venta');
    }
  };

  const handleUpdate = (updatedVenta) => {
    setVentas(ventas.map(v => v.id === updatedVenta.id ? updatedVenta : v));
  };

  const handleDelete = (id) => {
    setVentas(ventas.filter(v => v.id !== id));
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="container mx-auto py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-tech-gray-dark">Gestión de Ventas</h1>
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showForm ? 'Cancelar' : 'Registrar Venta'}
        </motion.button>
      </div>
      
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold text-tech-gray-dark mb-4">Nueva Venta</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Producto</label>
                  <select
                    name="producto_id"
                    value={formData.producto_id}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="">Seleccionar producto</option>
                    {productos.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.nombre} - ${producto.precio.toFixed(2)} - Stock: {producto.stock}
                      </option>
                    ))}
                  </select>
                  {errors.producto_id && <p className="form-error">{errors.producto_id}</p>}
                </div>
                
                <div>
                  <label className="form-label">Cantidad vendida</label>
                  <input
                    type="number"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0"
                  />
                  {errors.cantidad && <p className="form-error">{errors.cantidad}</p>}
                </div>
                
                <div>
                  <label className="form-label">Fecha de venta</label>
                  <input
                    type="date"
                    name="fecha_venta"
                    value={formData.fecha_venta}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {errors.fecha_venta && <p className="form-error">{errors.fecha_venta}</p>}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  type="submit"
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Registrar
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tech-blue"></div>
        </div>
      ) : ventas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-tech-gray-dark text-lg">No hay ventas registradas.</p>
          <motion.button
            onClick={() => setShowForm(true)}
            className="btn btn-primary mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Registrar Venta
          </motion.button>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {ventas.map((venta) => (
            <motion.div key={venta.id} variants={itemVariants}>
              <VentaCard 
                venta={venta} 
                onUpdate={handleUpdate}
                onDelete={handleDelete} 
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default VentasPage;
