import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVentas, createVenta, getProductos } from '../api/api';
import VentaCard from '../components/VentaCard';
import { toast } from 'sonner';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, ArrowUp, ArrowDown, Edit, Trash } from "lucide-react";

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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'table'
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

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

  // Sorting function for table view
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedVentas = React.useMemo(() => {
    if (!sortConfig.key) return ventas;
    
    return [...ventas].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [ventas, sortConfig]);

  // Formatear la fecha para mostrar en la tabla
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
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
        <h1 className="section-title text-3xl">Gestión de Ventas</h1>
        <div className="flex gap-4">
          <div className="bg-white border border-gray-200 p-1 rounded-xl shadow-sm flex">
            <button 
              onClick={() => setViewMode('grid')} 
              className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-tech-orange to-tech-pink text-white' : 'text-gray-500'}`}
            >
              Cards
            </button>
            <button 
              onClick={() => setViewMode('table')} 
              className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-gradient-to-r from-tech-orange to-tech-pink text-white' : 'text-gray-500'}`}
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
                Registrar Venta
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
              <span className="w-1.5 h-6 bg-gradient-to-b from-tech-orange to-tech-pink rounded-full"></span>
              Nueva Venta
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="flex justify-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-tech-orange"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-tech-orange-light opacity-20"></div>
          </div>
        </div>
      ) : ventas.length === 0 ? (
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="h-24 w-24 rounded-full bg-tech-orange-light/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-tech-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-tech-gray-dark text-xl mb-4">No hay ventas registradas.</p>
            <motion.button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Registrar Venta
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
          {ventas.map((venta) => (
            <VentaCard 
              key={venta.id}
              venta={venta} 
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
                  <TableHead onClick={() => requestSort('producto_nombre')} className="cursor-pointer hover:bg-gray-200 transition-colors">
                    <div className="flex items-center">
                      Producto
                      {sortConfig.key === 'producto_nombre' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => requestSort('cantidad')} className="cursor-pointer hover:bg-gray-200 transition-colors">
                    <div className="flex items-center">
                      Cantidad
                      {sortConfig.key === 'cantidad' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => requestSort('fecha_venta')} className="cursor-pointer hover:bg-gray-200 transition-colors">
                    <div className="flex items-center">
                      Fecha
                      {sortConfig.key === 'fecha_venta' && (
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
                  {sortedVentas.map((venta) => (
                    <motion.tr
                      key={venta.id}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 24
                      }}
                      className="border-b hover:bg-orange-50 transition-colors"
                    >
                      <TableCell className="font-medium">{venta.producto_nombre}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tech-orange-light/20 text-tech-orange-dark">
                          {venta.cantidad} unidades
                        </span>
                      </TableCell>
                      <TableCell>
                        {formatDate(venta.fecha_venta)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <motion.button
                          onClick={() => {
                            // Encuentra el card correspondiente y activa su modo de edición
                            const card = document.getElementById(`venta-${venta.id}`);
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
                          onClick={() => handleDelete(venta.id)}
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

export default VentasPage;
