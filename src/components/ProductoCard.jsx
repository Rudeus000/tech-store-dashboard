
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { updateProducto, deleteProducto } from '../api/api';
import { toast } from 'sonner';

const ProductoCard = ({ producto, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: producto.nombre,
    precio: producto.precio,
    stock: producto.stock,
  });
  const [errors, setErrors] = useState({});

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
      [name]: name === 'nombre' ? value : Number(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const response = await updateProducto(producto.id, formData);
      onUpdate(response.data);
      setIsEditing(false);
      toast.success('Producto actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      toast.error('Error al actualizar el producto');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProducto(producto.id);
      onDelete(producto.id);
      toast.success('Producto eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toast.error('Error al eliminar el producto');
    }
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
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-input"
            />
            {errors.nombre && <p className="form-error">{errors.nombre}</p>}
          </div>
          
          <div className="mb-3">
            <label className="form-label">Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              step="0.01"
              className="form-input"
            />
            {errors.precio && <p className="form-error">{errors.precio}</p>}
          </div>
          
          <div className="mb-4">
            <label className="form-label">Cantidad en stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="form-input"
            />
            {errors.stock && <p className="form-error">{errors.stock}</p>}
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
          <h3 className="text-lg font-semibold text-tech-gray-dark">{producto.nombre}</h3>
          <div className="mt-2 space-y-1">
            <p className="text-tech-blue text-xl font-bold">${producto.precio.toFixed(2)}</p>
            <p className="text-tech-gray">Stock: {producto.stock} unidades</p>
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

export default ProductoCard;
