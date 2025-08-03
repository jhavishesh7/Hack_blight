import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, Heart, Grid, List, Plus, Tag, MapPin, Package, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { listingService } from '../lib/services';
import { UserListing } from '../lib/supabase';
import { useToast } from '../contexts/ToastContext';

const Marketplace: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<'buy' | 'sell'>('buy');
  const [listings, setListings] = useState<UserListing[]>([]);
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshListings = async () => {
    try {
      setLoading(true);
      const [allListings, userOwnListings] = await Promise.all([
        listingService.getActiveListings(),
        user ? listingService.getUserListings(user.id) : Promise.resolve([])
      ]);
      
      setListings(allListings);
      setUserListings(userOwnListings);
      showToast('Listings refreshed!', 'success');
    } catch (error) {
      console.error('Error refreshing listings:', error);
      showToast('Failed to refresh listings', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch listings on component mount and when user changes
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const [allListings, userOwnListings] = await Promise.all([
          listingService.getActiveListings(),
          user ? listingService.getUserListings(user.id) : Promise.resolve([])
        ]);
        
        setListings(allListings);
        setUserListings(userOwnListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
        showToast('Failed to load listings', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, showToast]);

  // Refresh listings when component comes into focus (e.g., after creating a listing)
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        const fetchListings = async () => {
          try {
            const [allListings, userOwnListings] = await Promise.all([
              listingService.getActiveListings(),
              listingService.getUserListings(user.id)
            ]);
            
            setListings(allListings);
            setUserListings(userOwnListings);
          } catch (error) {
            console.error('Error refreshing listings:', error);
          }
        };
        fetchListings();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const categories = [
    { id: 'all', name: 'All Products', count: 156 },
    { id: 'plants', name: 'Plants', count: 89 },
    { id: 'pots', name: 'Pots & Planters', count: 34 },
    { id: 'tools', name: 'Tools', count: 23 },
    { id: 'fertilizers', name: 'Fertilizers', count: 10 },
  ];

  // Filter listings based on search and category
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (listing.description && listing.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6 mt-16 lg:mt-0">
      {/* Section Toggle */}
      <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveSection('buy')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === 'buy'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4 inline mr-2" />
            Buy
          </button>
          <button
            onClick={() => setActiveSection('sell')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === 'sell'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Tag className="w-4 h-4 inline mr-2" />
            Sell
          </button>
        </div>
      </div>

      {activeSection === 'buy' ? (
        <>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          
          <button
            onClick={refreshListings}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh listings"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
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

          {/* Price Filter */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input type="number" placeholder="Min" className="w-20 px-2 py-1 border rounded text-sm" />
                <span className="text-gray-500">-</span>
                <input type="number" placeholder="Max" className="w-20 px-2 py-1 border rounded text-sm" />
              </div>
              <button className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                Apply
              </button>
            </div>
          </div>

          {/* Featured Seller */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Seller</h3>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🌿</span>
              </div>
              <h4 className="font-semibold text-gray-900">Green Paradise</h4>
              <p className="text-sm text-gray-600">Premium Plant Nursery</p>
              <div className="flex items-center justify-center space-x-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">500+ positive reviews</p>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading listings...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {filteredListings.length} listings found
                </p>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option>Sort by relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                      <div className="relative">
                        <img
                          src={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://images.pexels.com/photos/2125275/pexels-photo-2125275.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={listing.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded text-xs font-medium">
                          {listing.condition}
                        </div>
                        <button className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-colors">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{listing.profiles?.full_name || 'Anonymous'}</p>
                        
                        {listing.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{listing.description}</p>
                        )}
                        
                        {listing.location && (
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {listing.location}
                          </div>
                        )}
                        
                                                 <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-2">
                             <span className="font-bold text-gray-900">
                               {listing.currency === 'NPR' ? 'रु' : listing.currency === 'USD' ? '$' : listing.currency === 'EUR' ? '€' : listing.currency === 'GBP' ? '£' : 'रु'}{listing.price}
                             </span>
                             <span className="text-sm text-gray-500">{listing.currency}</span>
                           </div>
                           <button 
                             onClick={() => navigate(`/buy/${listing.id}`)}
                             className="p-2 rounded-lg transition-colors bg-emerald-600 text-white hover:bg-emerald-700"
                           >
                             <ShoppingCart className="w-4 h-4" />
                           </button>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredListings.map((listing) => (
                    <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-6">
                        <img
                          src={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://images.pexels.com/photos/2125275/pexels-photo-2125275.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={listing.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{listing.profiles?.full_name || 'Anonymous'}</p>
                              {listing.description && (
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{listing.description}</p>
                              )}
                              {listing.location && (
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {listing.location}
                                </div>
                              )}
                            </div>
                                                         <div className="text-right">
                               <div className="flex items-center space-x-2 mb-2">
                                 <span className="font-bold text-xl text-gray-900">
                                   {listing.currency === 'NPR' ? 'रु' : listing.currency === 'USD' ? '$' : listing.currency === 'EUR' ? '€' : listing.currency === 'GBP' ? '£' : 'रु'}{listing.price}
                                 </span>
                                 <span className="text-sm text-gray-500">{listing.currency}</span>
                               </div>
                               <button 
                                 onClick={() => navigate(`/buy/${listing.id}`)}
                                 className="px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 bg-emerald-600 text-white hover:bg-emerald-700"
                               >
                                 <ShoppingCart className="w-4 h-4" />
                                 <span>Buy Now</span>
                               </button>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {filteredListings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No listings found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  ) : (
    // Sell Section
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Sell Your Plants</h1>
        <button
          onClick={() => navigate('/sell/new')}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Listing</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Selling Your Plants</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Turn your plant collection into profit! List your plants for sale and connect with fellow plant enthusiasts.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/sell/new')}
              className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Create Your First Listing
            </button>
            <div className="text-sm text-gray-500">
              <p>• No listing fees</p>
              <p>• Easy to manage</p>
              <p>• Reach plant lovers worldwide</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Listings Section */}
      {user && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Listings</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-6 h-6 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-500">Loading your listings...</p>
            </div>
          ) : userListings.length > 0 ? (
            <div className="space-y-4">
              {userListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <img
                      src={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://images.pexels.com/photos/2125275/pexels-photo-2125275.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={listing.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">{listing.title}</h4>
                      <p className="text-sm text-gray-600">${listing.price} {listing.currency}</p>
                      <p className="text-xs text-gray-500">Status: {listing.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      Edit
                    </button>
                    <button className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">You haven't created any listings yet.</p>
              <button
                onClick={() => navigate('/sell/new')}
                className="mt-2 text-green-600 hover:text-green-700 font-medium"
              >
                Create your first listing →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )}
    </div>
  );
};

export default Marketplace;