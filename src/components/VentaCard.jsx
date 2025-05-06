
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { updateVenta, deleteVenta } from '../api/api';
import { toast } from 'sonner';

const VentaCard = ({ venta, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    producto_id: venta.producto_id,
    producto_nombre: venta.producto_nombre,
    cantidad: venta.cantidad,
    fecha_venta: venta.fecha_venta ? venta.fecha_venta.split('T')[0] : new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.cantidad || formData.cantidad <= 0) newErrors.cantidad = 'La cantidad debe ser mayor a 0';
    if (!formData.fecha_venta) newErrors.fecha_venta = 'La fecha es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'cantidad' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const response = await updateVenta(venta.id, formData);
      onUpdate(response.data);
      setIsEditing(false);
      toast.success('Venta actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar venta:', error);
      toast.error('Error al actualizar la venta');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVenta(venta.id);
      onDelete(venta.id);
      toast.success('Venta eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      toast.error('Error al eliminar la venta');
    }
  };

  // Formatear la fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden card-hover"
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      transition={{ duration: 0.2 }}
    >
      {isEditing ? (
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-3">
            <label className="form-label">Producto</label>
            <input
              type="text"
              value={formData.producto_nombre}
              disabled
              className="form-input bg-gray-100"
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Cantidad vendida</label>
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              className="form-input"
            />
            {errors.cantidad && <p className="form-error">{errors.cantidad}</p>}
          </div>
          
          <div className="mb-4">
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
          
          <div className="flex justify-end space-x-2">
            <motion.button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancelar
            </motion.button>
            <motion.button
              type="submit"
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Guardar cambios
            </motion.button>
          </div>
        </form>
      ) : (
        <div className="p-4">
          <h3 className="text-lg font-semibold text-tech-gray-dark">{venta.producto_nombre}</h3>
          <div className="mt-2 space-y-1">
            <p className="text-tech-gray">Cantidad: <span className="font-medium">{venta.cantidad} unidades</span></p>
            <p className="text-tech-gray">Fecha: <span className="font-medium">{formatDate(venta.fecha_venta)}</span></p>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <motion.button
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Editar
            </motion.button>
            <motion.button
              onClick={handleDelete}
              className="btn btn-danger"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Eliminar
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default VentaCard;
