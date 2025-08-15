import { useState, useEffect, useCallback } from 'react';
import { loadCategories, saveCategories } from '../utils/localStorage';
import { getRandomCategoryColor } from '../utils/theme';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);

  // Load categories from localStorage on mount
  useEffect(() => {
    const stored = loadCategories();
    setCategories(stored);
  }, []);

  // Add a new category
  const addCategory = useCallback((title, notes = '') => {
    const newCategory = {
      id: Date.now().toString(),
      title,
      notes,
      color: getRandomCategoryColor(),
      createdAt: new Date().toISOString()
    };

    const updated = [...categories, newCategory];
    setCategories(updated);
    saveCategories(updated);
  }, [categories]);

  // Update a category
  const updateCategory = useCallback((id, updates) => {
    const updated = categories.map(category =>
      category.id === id ? { ...category, ...updates } : category
    );
    setCategories(updated);
    saveCategories(updated);
  }, [categories]);

  // Delete a category
  const deleteCategory = useCallback((id) => {
    const updated = categories.filter(category => category.id !== id);
    setCategories(updated);
    saveCategories(updated);
  }, [categories]);

  // Get category by ID
  const getCategoryById = useCallback((id) => {
    return categories.find(category => category.id === id);
  }, [categories]);

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById
  };
};
