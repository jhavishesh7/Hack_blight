import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plant } from '../lib/supabase';
import { plantService } from '../lib/services';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { useData } from '../contexts/DataContext';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  X, 
  Save, 
  Calendar,
  Droplets,
  Sun,
  Thermometer,
  Tag
} from 'lucide-react';

interface PlantManagementProps {
  onPlantAdded?: (plant: Plant) => void;
  onPlantUpdated?: (plant: Plant) => void;
  onPlantDeleted?: (plantId: string) => void;
}

const PlantManagement: React.FC<PlantManagementProps> = ({
  onPlantAdded,
  onPlantUpdated,
  onPlantDeleted
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { plants, loading, addPlant, updatePlant, deletePlant } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    location: '',
    health_score: 100,
    notes: ''
  });



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      showToast('error', 'Authentication required', 'Please sign in to add plants.');
      return;
    }

    try {
      const plantData = {
        ...formData,
        user_id: user.id,
        health_score: parseInt(formData.health_score.toString())
      };

      if (editingPlant) {
        // Update existing plant
        const updatedPlant = await plantService.updatePlant(editingPlant.id, plantData);
        updatePlant(updatedPlant);
        onPlantUpdated?.(updatedPlant);
        showToast('success', 'Plant updated successfully', `${updatedPlant.name} has been updated.`);
      } else {
        // Create new plant
        const newPlant = await plantService.createPlant(plantData);
        addPlant(newPlant);
        onPlantAdded?.(newPlant);
        showToast('success', 'Plant added successfully', `${newPlant.name} has been added to your collection.`);
      }

      closeModal();
    } catch (error) {
      console.error('Error saving plant:', error);
      showToast('error', 'Failed to save plant', 'Please check your input and try again.');
    }
  };

  const handleDelete = async (plantId: string, plantName: string) => {
    if (!confirm(`Are you sure you want to delete ${plantName}?`)) {
      return;
    }

    try {
      await plantService.deletePlant(plantId);
      deletePlant(plantId);
      onPlantDeleted?.(plantId);
      showToast('success', 'Plant deleted', `${plantName} has been removed from your collection.`);
    } catch (error) {
      console.error('Error deleting plant:', error);
      showToast('error', 'Failed to delete plant', 'Please try again.');
    }
  };

  const openModal = (plant?: Plant) => {
    if (plant) {
      setEditingPlant(plant);
      setFormData({
        name: plant.name,
        species: plant.species || '',
        location: plant.location || '',
        health_score: plant.health_score,
        notes: plant.notes || ''
      });
    } else {
      setEditingPlant(null);
      setFormData({
        name: '',
        species: '',
        location: '',
        health_score: 100,
        notes: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlant(null);
    setFormData({
      name: '',
      species: '',
      location: '',
      health_score: 100,
      notes: ''
    });
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Plants</h2>
          <p className="text-gray-600 mt-1">Manage your plant collection and track their health</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/sell/new')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Tag className="w-4 h-4" />
            <span>Sell Now</span>
          </button>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Plant</span>
          </button>
        </div>
      </div>

      {/* Plants Grid */}
      {plants.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sun className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No plants yet</h3>
          <p className="text-gray-600 mb-4">Start your plant collection by adding your first plant!</p>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Your First Plant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plants.map((plant) => (
            <div key={plant.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{plant.name}</h3>
                    {plant.species && (
                      <p className="text-sm text-gray-600 mb-2">{plant.species}</p>
                    )}
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(plant.health_score)}`}>
                      <Thermometer className="w-3 h-3 mr-1" />
                      {plant.health_score}% Health
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(plant)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plant.id, plant.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              
                             {plant.location && (
                 <div className="flex items-center text-sm text-gray-600 mb-3">
                   <Sun className="w-4 h-4 mr-2" />
                   {plant.location}
                 </div>
               )}
               
               {plant.notes && (
                 <p className="text-sm text-gray-700 mb-4 line-clamp-2">{plant.notes}</p>
               )}
               
               <div className="flex items-center justify-between text-xs text-gray-500">
                 <span>Added {new Date(plant.created_at).toLocaleDateString()}</span>
                 <span>ID: {plant.id.slice(0, 8)}...</span>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingPlant ? 'Edit Plant' : 'Add New Plant'}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Monstera Deliciosa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Species
                </label>
                <input
                  type="text"
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Monstera deliciosa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Living room window"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Score
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.health_score}
                  onChange={(e) => setFormData({ ...formData, health_score: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>0%</span>
                  <span>{formData.health_score}%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Any special care instructions or notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPlant ? 'Update' : 'Add'} Plant</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantManagement; 