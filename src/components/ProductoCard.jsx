
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
      id={`producto-${producto.id}`}
      className="card-modern overflow-hidden"
      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {isEditing ? (
        <motion.form 
          onSubmit={handleSubmit} 
          className="p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4">
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
          
          <div className="mb-4">
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
          
          <div className="mb-6">
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
          
          <div className="flex justify-end space-x-3">
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
        </motion.form>
      ) : (
        <div className="relative">
          <motion.div 
            className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-tech-blue-light/20 to-tech-purple-light/30 -rotate-45 transform origin-top-left"
            whileHover={{ scale: 1.2, rotate: -50 }}
          />
          <div className="p-6 relative">
            <h3 className="text-xl font-bold mb-2 text-tech-gray-dark">{producto.nombre}</h3>
            <div className="space-y-2">
              <p className="text-2xl font-extrabold bg-gradient-to-r from-tech-blue to-tech-purple bg-clip-text text-transparent">
                ${producto.precio.toFixed(2)}
              </p>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${producto.stock > 10 ? 'bg-green-500' : producto.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <p className="text-tech-gray">
                  {producto.stock > 0 ? `${producto.stock} unidades disponibles` : 'Sin existencias'}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
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
        </div>
      )}
    </motion.div>
  );
};

export default ProductoCard;
