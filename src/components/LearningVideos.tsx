import React, { useState } from 'react';
import { Play, Clock, User, Star, Search, Filter } from 'lucide-react';

const LearningVideos: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Videos', count: 48 },
    { id: 'watering', name: 'Watering', count: 12 },
    { id: 'fertilizing', name: 'Fertilizing', count: 8 },
    { id: 'pruning', name: 'Pruning', count: 10 },
    { id: 'propagation', name: 'Propagation', count: 9 },
    { id: 'pest-control', name: 'Pest Control', count: 9 },
  ];

  const videos = [
    {
      id: 1,
      title: 'Complete Guide to Watering Indoor Plants',
      thumbnail: 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '12:34',
      instructor: 'Sarah Green',
      rating: 4.8,
      views: '24.5K',
      category: 'watering',
      description: 'Learn the fundamentals of proper watering techniques for different types of indoor plants.'
    },
    {
      id: 2,
      title: 'Monstera Deliciosa Care and Propagation',
      thumbnail: 'https://images.pexels.com/photos/2125275/pexels-photo-2125275.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '18:42',
      instructor: 'Mike Chen',
      rating: 4.9,
      views: '18.2K',
      category: 'propagation',
      description: 'Everything you need to know about caring for and propagating your Monstera Deliciosa.'
    },
    {
      id: 3,
      title: 'Identifying and Treating Common Plant Pests',
      thumbnail: 'https://images.pexels.com/photos/1400375/pexels-photo-1400375.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '15:28',
      instructor: 'Dr. Lisa Park',
      rating: 4.7,
      views: '32.1K',
      category: 'pest-control',
      description: 'Comprehensive guide to identifying, preventing, and treating common indoor plant pests.'
    },
    {
      id: 4,
      title: 'Pruning Techniques for Healthy Growth',
      thumbnail: 'https://images.pexels.com/photos/1158954/pexels-photo-1158954.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '10:15',
      instructor: 'Tom Wilson',
      rating: 4.6,
      views: '15.8K',
      category: 'pruning',
      description: 'Master the art of pruning to promote healthy growth and maintain plant shape.'
    },
    {
      id: 5,
      title: 'Fertilizing Schedule for Maximum Growth',
      thumbnail: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '14:07',
      instructor: 'Anna Rodriguez',
      rating: 4.8,
      views: '21.3K',
      category: 'fertilizing',
      description: 'Create the perfect fertilizing schedule for your plants throughout the seasons.'
    },
    {
      id: 6,
      title: 'Snake Plant Care: The Beginner\'s Guide',
      thumbnail: 'https://images.pexels.com/photos/2123339/pexels-photo-2123339.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: '8:52',
      instructor: 'Kevin Brown',
      rating: 4.5,
      views: '28.7K',
      category: 'watering',
      description: 'Perfect for beginners - learn how to care for one of the most resilient indoor plants.'
    },
  ];

  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 mt-16 lg:mt-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Learning Videos</h1>
        
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Categories Sidebar */}
        <div className="lg:w-64 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors
                    ${selectedCategory === category.id
                      ? 'bg-emerald-100 text-emerald-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <span>{category.name}</span>
                  <span className="text-sm text-gray-500">{category.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Instructor */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Instructor</h3>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Dr. Lisa Park</h4>
              <p className="text-sm text-gray-600">Plant Pathologist</p>
              <div className="flex items-center justify-center space-x-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">15+ years experience</p>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white bg-opacity-90 p-3 rounded-full hover:bg-opacity-100 transition-colors">
                      <Play className="w-6 h-6 text-gray-900 ml-1" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{video.duration}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{video.instructor}</span>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{video.rating}</span>
                      </div>
                      <span>{video.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No videos found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningVideos;