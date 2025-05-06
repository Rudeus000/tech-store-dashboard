import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVentas, createVenta, getProductos } from '../api/api';
import VentaCard from '../components/VentaCard';
import { toast } from 'sonner';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Plus, ArrowUp, ArrowDown, Edit, Trash } from "lucide-react";
import ElegantForm from '../components/ElegantForm';
import FormField from '../components/FormField';

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

  // Preparar opciones para el selector de productos
  const productOptions = productos.map(p => ({
    value: p.id,
    label: `${p.nombre} - $${p.precio.toFixed(2)} - Stock: ${p.stock}`
  }));

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
          <div className="view-switcher">
            <button 
              onClick={() => setViewMode('grid')} 
              className={`view-switcher-button ${viewMode === 'grid' ? 'view-switcher-button-active' : 'view-switcher-button-inactive'}`}
            >
              Cards
            </button>
            <button 
              onClick={() => setViewMode('table')} 
              className={`view-switcher-button ${viewMode === 'table' ? 'view-switcher-button-active' : 'view-switcher-button-inactive'}`}
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
            className="mb-8"
          >
            <ElegantForm 
              title="Nueva Venta"
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              submitText="Registrar Venta"
              color="orange"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  label="Producto"
                  name="producto_id"
                  type="select"
                  value={formData.producto_id}
                  onChange={handleChange}
                  placeholder="Seleccionar producto"
                  options={productOptions}
                  error={errors.producto_id}
                />
                
                <FormField
                  label="Cantidad vendida"
                  name="cantidad"
                  type="number"
                  value={formData.cantidad}
                  onChange={handleChange}
                  placeholder="0"
                  error={errors.cantidad}
                />
                
                <FormField
                  label="Fecha de venta"
                  name="fecha_venta"
                  type="date"
                  value={formData.fecha_venta}
                  onChange={handleChange}
                  error={errors.fecha_venta}
                />
              </div>
            </ElegantForm>
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
          className="table-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="table-header">
                  <TableHead onClick={() => requestSort('producto_nombre')} className="table-header-cell">
                    <div className="flex items-center">
                      Producto
                      {sortConfig.key === 'producto_nombre' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => requestSort('cantidad')} className="table-header-cell">
                    <div className="flex items-center">
                      Cantidad
                      {sortConfig.key === 'cantidad' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => requestSort('fecha_venta')} className="table-header-cell">
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
                      className="table-row-alt"
                    >
                      <TableCell className="font-medium">{venta.producto_nombre}</TableCell>
                      <TableCell>
                        <span className="status-badge status-badge-yellow">
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
                          className="action-button action-button-edit"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(venta.id)}
                          className="action-button action-button-delete"
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
