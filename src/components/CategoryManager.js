import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { theme } from '../utils/theme';

const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [newCategoryNotes, setNewCategoryNotes] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const handleAddCategory = () => {
    if (newCategoryTitle.trim()) {
      addCategory(newCategoryTitle.trim(), newCategoryNotes.trim());
      setNewCategoryTitle('');
      setNewCategoryNotes('');
    }
  };

  const handleEditCategory = (category) => {
    setEditingId(category.id);
    setEditTitle(category.title);
    setEditNotes(category.notes);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      updateCategory(editingId, {
        title: editTitle.trim(),
        notes: editNotes.trim()
      });
      setEditingId(null);
      setEditTitle('');
      setEditNotes('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditNotes('');
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all associated timer data.')) {
      deleteCategory(id);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Add New Category</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category-title">Category Title</label>
            <input
              id="category-title"
              type="text"
              className="input"
              value={newCategoryTitle}
              onChange={(e) => setNewCategoryTitle(e.target.value)}
              placeholder="Enter category title..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="category-notes">Notes</label>
            <input
              id="category-notes"
              type="text"
              className="input"
              value={newCategoryNotes}
              onChange={(e) => setNewCategoryNotes(e.target.value)}
              placeholder="Enter category notes..."
            />
          </div>
          <div className="form-group">
            <button
              className="btn btn-primary"
              onClick={handleAddCategory}
              disabled={!newCategoryTitle.trim()}
            >
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Categories ({categories.length})</h2>
        {categories.length === 0 ? (
          <p className="text-center">No categories yet. Add your first category to get started!</p>
        ) : (
          <div className="grid grid-2">
            {categories.map(category => (
              <div
                key={category.id}
                className="card"
                style={{
                  borderLeft: `4px solid ${category.color}`,
                  backgroundColor: '#f8f9fa'
                }}
              >
                {editingId === category.id ? (
                  <div>
                    <div className="form-group">
                      <label>Title:</label>
                      <input
                        type="text"
                        className="input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Notes:</label>
                      <textarea
                        className="textarea"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        rows="3"
                      />
                    </div>
                    <div className="flex">
                      <button
                        className="btn btn-primary"
                        onClick={handleSaveEdit}
                        disabled={!editTitle.trim()}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex-between mb-2">
                      <h3 style={{ color: category.color }}>
                        {category.title}
                      </h3>
                      <div className="flex">
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEditCategory(category)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    
                    {category.notes && (
                      <p className="mb-2" style={{ color: '#666' }}>
                        {category.notes}
                      </p>
                    )}
                    
                    <div className="text-center">
                      <small style={{ color: '#666' }}>
                        Created: {new Date(category.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
