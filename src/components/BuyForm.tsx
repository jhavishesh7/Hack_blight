import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../contexts/ToastContext';
import { listingService, notificationService } from '../lib/services';
import { UserListing } from '../lib/supabase';
import { ArrowLeft, MapPin, Package, CreditCard, Truck, CheckCircle } from 'lucide-react';

const BuyForm: React.FC = () => {
  const navigate = useNavigate();
  const { listingId } = useParams<{ listingId: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [listing, setListing] = useState<UserListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerPhone: '',
    deliveryAddress: '',
    deliveryInstructions: '',
    paymentMethod: 'cod' as 'cod' | 'card',
    agreeToTerms: false
  });

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) return;
      
      try {
        setLoading(true);
        const data = await listingService.getListing(listingId);
        setListing(data);
      } catch (error) {
        console.error('Error fetching listing:', error);
        showToast('Failed to load listing details', 'error');
        navigate('/marketplace');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId, navigate, showToast]);

  useEffect(() => {
    if (user && listing) {
      setFormData(prev => ({
        ...prev,
        buyerName: user.user_metadata?.full_name || '',
        buyerEmail: user.email || ''
      }));
    }
  }, [user, listing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !listing) {
      showToast('Please log in to purchase this item', 'error');
      return;
    }

    if (!formData.agreeToTerms) {
      showToast('Please agree to the terms and conditions', 'error');
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Complete purchase using secure database function
      await listingService.completePurchase(
        listing.id,
        user.id,
        formData.buyerName,
        formData.buyerEmail,
        formData.buyerPhone,
        formData.deliveryAddress,
        formData.deliveryInstructions
      );

      showToast('Purchase successful! The seller has been notified.', 'success');
      navigate('/marketplace');
    } catch (error) {
      console.error('Error processing purchase:', error);
      showToast('Failed to process purchase. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Listing not found.</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="mt-4 text-green-600 hover:text-green-700"
        >
          Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-16 lg:mt-0">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/marketplace')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Purchase</h1>
          <p className="text-gray-600 mt-1">Finalize your purchase with secure payment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Summary</h2>
            
            <div className="flex items-start space-x-4">
              <img
                src={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://images.pexels.com/photos/2125275/pexels-photo-2125275.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={listing.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{listing.profiles?.full_name || 'Anonymous'}</p>
                                 <div className="flex items-center space-x-2 mb-2">
                   <span className="text-lg font-bold text-green-600">
                     {listing.currency === 'NPR' ? 'रु' : listing.currency === 'USD' ? '$' : listing.currency === 'EUR' ? '€' : listing.currency === 'GBP' ? '£' : 'रु'}{listing.price}
                   </span>
                   <span className="text-sm text-gray-500">{listing.currency}</span>
                 </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  {listing.location || 'Location not specified'}
                </div>
              </div>
            </div>

            {listing.description && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">{listing.description}</p>
              </div>
            )}
          </div>

          {/* Delivery Options */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Options</h2>
            
            <div className="space-y-3">
              {listing.local_pickup && (
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="pickup"
                    defaultChecked
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Local Pickup</div>
                    <div className="text-sm text-gray-500">Pick up from seller's location</div>
                  </div>
                </div>
              )}
              
              {listing.shipping_available && (
                <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                  <input
                    type="radio"
                    name="deliveryType"
                    value="shipping"
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">Shipping</div>
                    <div className="text-sm text-gray-500">Delivered to your address (+$5.99)</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Purchase Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Buyer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Buyer Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="buyerEmail"
                    value={formData.buyerEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="buyerPhone"
                    value={formData.buyerPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your delivery address..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Instructions
                  </label>
                  <textarea
                    name="deliveryInstructions"
                    value={formData.deliveryInstructions}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border-2 border-green-500 rounded-lg bg-green-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                  />
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">Cash on Delivery (COD)</div>
                      <div className="text-sm text-gray-500">Pay when you receive the item</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
                />
                <div className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-green-600 hover:text-green-700 underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-green-600 hover:text-green-700 underline">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || !formData.agreeToTerms}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing Purchase...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                                     <span>Complete Purchase - {listing.currency === 'NPR' ? 'रु' : listing.currency === 'USD' ? '$' : listing.currency === 'EUR' ? '€' : listing.currency === 'GBP' ? '£' : 'रु'}{listing.price} {listing.currency}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BuyForm; 