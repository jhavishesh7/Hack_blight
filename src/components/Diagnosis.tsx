import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  Leaf, 
  Clock, 
  TrendingUp, 
  Shield, 
  Sparkles,
  Download,
  Share2,
  MessageCircle,
  Calendar,
  Zap,
  Droplets,
  Sun,
  Thermometer,
  X
} from 'lucide-react';

interface DetectionResult {
  disease: string;
  confidence: number;
  description?: string;
  treatment?: string;
  severity?: 'low' | 'medium' | 'high';
  imageUrl: string;
}

interface DiseasePrediction {
  class: string;
  confidence: number;
}

const Diagnosis: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonMessage, setComingSoonMessage] = useState('');
  
  const { detectionResult, allPredictions, originalImage } = location.state as { 
    detectionResult: DetectionResult; 
    allPredictions?: DiseasePrediction[];
    originalImage: string;
  };

  if (!detectionResult) {
    navigate('/disease-detection');
    return null;
  }

  const handleComingSoon = (message: string) => {
    setComingSoonMessage(message);
    setShowComingSoon(true);
    setTimeout(() => setShowComingSoon(false), 3000);
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'low': return <CheckCircle className="w-5 h-5" />;
      case 'medium': return <AlertTriangle className="w-5 h-5" />;
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      default: return <Leaf className="w-5 h-5" />;
    }
  };

  const getDiseaseIcon = (disease: string) => {
    const diseaseIcons: { [key: string]: React.ReactNode } = {
      'healthy': <CheckCircle className="w-6 h-6" />,
      'early_blight': <AlertTriangle className="w-6 h-6" />,
      'late_blight': <AlertTriangle className="w-6 h-6" />,
      'leaf_mold': <Leaf className="w-6 h-6" />,
      'septoria_leaf_spot': <Leaf className="w-6 h-6" />,
      'spider_mites': <AlertTriangle className="w-6 h-6" />,
      'target_spot': <Leaf className="w-6 h-6" />,
      'yellow_leaf_curl_virus': <AlertTriangle className="w-6 h-6" />,
      'mosaic_virus': <AlertTriangle className="w-6 h-6" />
    };
    return diseaseIcons[disease.toLowerCase()] || <Leaf className="w-6 h-6" />;
  };

  const getTreatmentSteps = (disease: string) => {
    const treatmentSteps: { [key: string]: string[] } = {
      'healthy': [
        'Continue regular watering schedule',
        'Maintain proper fertilization',
        'Monitor for any changes',
        'Keep good air circulation'
      ],
      'early_blight': [
        'Remove and destroy affected leaves',
        'Improve air circulation around plants',
        'Apply copper-based fungicide',
        'Avoid overhead watering'
      ],
      'late_blight': [
        'Remove infected plants immediately',
        'Apply copper-based fungicide',
        'Improve drainage and air circulation',
        'Avoid overhead watering'
      ],
      'leaf_mold': [
        'Remove affected leaves',
        'Improve air circulation',
        'Reduce humidity levels',
        'Apply fungicide if necessary'
      ],
      'septoria_leaf_spot': [
        'Remove infected leaves',
        'Avoid overhead watering',
        'Apply fungicide',
        'Improve plant spacing'
      ],
      'spider_mites': [
        'Spray with insecticidal soap',
        'Increase humidity around plants',
        'Isolate affected plants',
        'Apply neem oil treatment'
      ],
      'target_spot': [
        'Remove affected leaves',
        'Improve air circulation',
        'Apply fungicide',
        'Avoid overhead watering'
      ],
      'yellow_leaf_curl_virus': [
        'Remove infected plants',
        'Control whitefly population',
        'Use resistant varieties',
        'Maintain clean growing area'
      ],
      'mosaic_virus': [
        'Remove infected plants',
        'Control aphid population',
        'Use virus-free seeds',
        'Disinfect tools and equipment'
      ]
    };
    
    return treatmentSteps[disease.toLowerCase()] || [
      'Consult with a plant expert',
      'Monitor plant health closely',
      'Maintain proper care routine',
      'Consider professional treatment'
    ];
  };

  const getPreventionTips = (disease: string) => {
    const preventionTips: { [key: string]: string[] } = {
      'healthy': [
        'Maintain consistent watering',
        'Use balanced fertilizer',
        'Provide adequate sunlight',
        'Monitor for pests regularly'
      ],
      'early_blight': [
        'Plant resistant varieties',
        'Maintain good air circulation',
        'Avoid overhead watering',
        'Rotate crops annually'
      ],
      'late_blight': [
        'Plant resistant varieties',
        'Ensure proper drainage',
        'Maintain good air circulation',
        'Monitor weather conditions'
      ],
      'leaf_mold': [
        'Control humidity levels',
        'Improve air circulation',
        'Avoid overcrowding plants',
        'Use resistant varieties'
      ],
      'septoria_leaf_spot': [
        'Use disease-free seeds',
        'Maintain good air circulation',
        'Avoid overhead watering',
        'Clean garden debris regularly'
      ],
      'spider_mites': [
        'Maintain adequate humidity',
        'Monitor plants regularly',
        'Isolate new plants',
        'Use beneficial insects'
      ],
      'target_spot': [
        'Use resistant varieties',
        'Maintain good air circulation',
        'Avoid overhead watering',
        'Clean garden tools regularly'
      ],
      'yellow_leaf_curl_virus': [
        'Use resistant varieties',
        'Control whitefly population',
        'Use row covers',
        'Maintain clean growing area'
      ],
      'mosaic_virus': [
        'Use virus-free seeds',
        'Control aphid population',
        'Disinfect tools regularly',
        'Remove infected plants promptly'
      ]
    };
    
    return preventionTips[disease.toLowerCase()] || [
      'Maintain good plant hygiene',
      'Monitor plants regularly',
      'Use quality seeds and plants',
      'Follow proper care practices'
    ];
  };

  return (
    <div className="space-y-6 mt-16 lg:mt-0">
      {/* Coming Soon Popup */}
      {showComingSoon && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-in slide-in-from-right">
          <Sparkles className="w-4 h-4" />
          <span>{comingSoonMessage}</span>
          <button
            onClick={() => setShowComingSoon(false)}
            className="ml-2 hover:bg-blue-700 rounded p-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/disease-detection')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Disease Diagnosis</h1>
            <p className="text-gray-600 mt-1">Detailed analysis and treatment recommendations</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleComingSoon('Download feature coming soon!')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
          <button 
            onClick={() => handleComingSoon('Share feature coming soon!')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Diagnosis Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Diagnosis */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  {getDiseaseIcon(detectionResult.disease)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{detectionResult.disease.replace(/_/g, ' ').toUpperCase()}</h2>
                  <p className="text-gray-600">AI-Powered Diagnosis</p>
                </div>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getSeverityColor(detectionResult.severity)}`}>
                {getSeverityIcon(detectionResult.severity)}
                <span className="text-sm font-medium capitalize">{detectionResult.severity || 'unknown'} Severity</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">AI Confidence</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{detectionResult.confidence}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${detectionResult.confidence}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Analysis Time</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">~3s</div>
                <p className="text-xs text-gray-600 mt-1">Real-time AI processing</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Description</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                {detectionResult.description || 'Disease detected successfully using AI analysis. Please consult with a plant expert for detailed information about this specific condition.'}
              </p>
            </div>
          </div>

          {/* All Predictions */}
          {allPredictions && allPredictions.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                All AI Predictions
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allPredictions.map((prediction, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      index === 0 
                        ? 'bg-green-50 border-green-200 shadow-sm' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getDiseaseIcon(prediction.class)}
                        <span className={`font-semibold text-sm ${
                          index === 0 ? 'text-green-700' : 'text-gray-700'
                        }`}>
                          {prediction.class.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      {index === 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          Top Match
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Confidence</span>
                        <span className={`text-sm font-bold ${
                          index === 0 ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {Math.round(prediction.confidence * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            index === 0 ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${prediction.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-700">
                  <strong>Note:</strong> The AI analyzes multiple possible diseases. The top match is shown as the primary diagnosis, but consider all predictions for comprehensive care.
                </p>
              </div>
            </div>
          )}

          {/* Treatment Plan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Treatment Plan
            </h3>
            
            <div className="space-y-4">
              {getTreatmentSteps(detectionResult.disease).map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-green-600">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Important Note</span>
              </div>
              <p className="text-yellow-700 text-sm">
                For severe cases or if symptoms persist, consult with a plant expert or agricultural specialist for professional treatment.
              </p>
            </div>
          </div>

          {/* Prevention Tips */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Prevention Tips
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getPreventionTips(detectionResult.disease).map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Plant Image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Analyzed Image</h3>
            <img
              src={originalImage}
              alt="Analyzed plant"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleComingSoon('Expert advice feature coming soon!')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Get Expert Advice</span>
              </button>
              <button 
                onClick={() => handleComingSoon('Follow-up scheduling coming soon!')}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Follow-up</span>
              </button>
              <button 
                onClick={() => handleComingSoon('Report download coming soon!')}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            </div>
          </div>

          {/* Care Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Care Recommendations</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Watering</p>
                  <p className="text-xs text-gray-600">Keep soil moist but not soggy</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Sun className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Sunlight</p>
                  <p className="text-xs text-gray-600">6-8 hours of direct sunlight</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Thermometer className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Temperature</p>
                  <p className="text-xs text-gray-600">65-85°F (18-29°C)</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Confidence */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-900">AI Analysis</span>
            </div>
            <p className="text-green-800 text-sm mb-3">
              This diagnosis was performed using advanced AI technology with {detectionResult.confidence}% confidence.
            </p>
            <div className="text-xs text-green-700">
              Powered by PlantMD AI • Real-time analysis
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis; 