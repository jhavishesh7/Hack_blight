import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Leaf, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Shield, 
  Zap,
  Play,
  Star,
  ChevronDown,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Clock,
  TrendingUp,
  Award,
  Globe
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Leaf,
      title: "Smart Plant Care",
      description: "AI-powered care schedules and personalized recommendations for your plants"
    },
    {
      icon: CheckCircle,
      title: "Task Management",
      description: "Never miss watering, fertilizing, or pruning with intelligent reminders"
    },
    {
      icon: Users,
      title: "Expert Community",
      description: "Connect with plant enthusiasts and get advice from gardening experts"
    },
    {
      icon: Shield,
      title: "Disease Detection",
      description: "Early detection of plant diseases using advanced AI technology"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Plant Enthusiast",
      content: "PlantCare Pro transformed my gardening experience. My plants have never been healthier!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Urban Gardener",
      content: "The AI assistant is incredible. It's like having a personal plant expert 24/7.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Beginner Gardener",
      content: "Perfect for beginners! The step-by-step guidance helped me grow my first garden.",
      rating: 5
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Users", icon: Users },
    { number: "1M+", label: "Plants Cared For", icon: Leaf },
    { number: "99%", label: "Success Rate", icon: TrendingUp },
    { number: "24/7", label: "AI Support", icon: Clock }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Expert Guidance",
      description: "Get personalized advice from our AI-powered plant care system"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with plant lovers from around the world"
    },
    {
      icon: Shield,
      title: "Disease Prevention",
      description: "Early detection and prevention of common plant diseases"
    },
    {
      icon: Clock,
      title: "Perfect Timing",
      description: "Never miss the right time to water, fertilize, or prune"
    },
    {
      icon: TrendingUp,
      title: "Growth Tracking",
      description: "Monitor your plants' progress with detailed analytics"
    },
    {
      icon: Sparkles,
      title: "Smart Automation",
      description: "Automated care schedules that adapt to your lifestyle"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  const handleGetStarted = () => {
    if (user) {
      // User is already logged in, redirect to dashboard
      navigate('/dashboard');
    } else {
      // User needs to log in, redirect to signup
      navigate('/signup');
    }
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-green-900">PlantCare Pro</span>
                <p className="text-xs text-green-600 -mt-1">AI-Powered Plant Care</p>
              </div>
            </div>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {user ? 'Go to Dashboard' : 'Get Started'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full opacity-10 animate-float"></div>
              <div className="absolute top-40 right-10 w-96 h-96 bg-green-300 rounded-full opacity-5 animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-green-100 rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10">
              <div className="mb-8">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Powered Plant Care Platform</span>
                </div>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Your Plants Deserve
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800 mt-2">
                  Expert Care
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                AI-powered plant care that adapts to your lifestyle. Never worry about your plants again with personalized care schedules and expert guidance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <button
                  onClick={handleGetStarted}
                  className="group px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold text-lg flex items-center space-x-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 min-w-[200px] justify-center"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group px-8 py-4 border-2 border-green-600 text-green-600 rounded-2xl hover:bg-green-50 transition-all duration-300 font-semibold text-lg flex items-center space-x-3 hover:shadow-lg transform hover:-translate-y-1 min-w-[200px] justify-center">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>
            
            {/* Feature Cards */}
            <div className="relative mt-20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] bg-gradient-to-r from-green-200 to-green-300 rounded-full opacity-20 animate-pulse blur-3xl"></div>
              </div>
              <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-100 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <Leaf className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Smart Care</h3>
                    <p className="text-gray-600 text-center leading-relaxed">AI-powered recommendations tailored to your plants and environment</p>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-100 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Easy Tracking</h3>
                    <p className="text-gray-600 text-center leading-relaxed">Never miss a care task with intelligent reminders and scheduling</p>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-100 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Community</h3>
                    <p className="text-gray-600 text-center leading-relaxed">Connect with plant experts and fellow enthusiasts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={scrollToFeatures}
            className="animate-bounce p-3 text-green-600 hover:text-green-700 transition-colors bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                Perfect Plants
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From beginners to experts, PlantCare Pro has the tools you need to grow healthy, thriving plants with confidence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`text-center p-8 rounded-3xl transition-all duration-500 transform hover:-translate-y-2 ${
                    currentFeature === index 
                      ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-2xl' 
                      : 'bg-white hover:bg-green-50 border-2 border-transparent hover:border-green-200 shadow-lg hover:shadow-2xl'
                  }`}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why Choose
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                PlantCare Pro?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the advantages that make PlantCare Pro the ultimate choice for plant enthusiasts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-3xl p-8 hover:bg-green-50 transition-all duration-500 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-200 rounded-full text-green-800 text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>Trusted by Plant Parents</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Loved by Plant Parents
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                Everywhere
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join thousands of happy users who've transformed their gardening experience with PlantCare Pro.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic text-lg leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-green-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-600 to-green-700 opacity-90"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="block">Plant Care?</span>
          </h2>
          <p className="text-xl text-green-100 mb-10 leading-relaxed">
            Join thousands of plant parents who've already discovered the secret to thriving plants with AI-powered care.
          </p>
          <button
            onClick={handleGetStarted}
            className="group px-10 py-5 bg-white text-green-600 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-bold text-xl flex items-center space-x-3 mx-auto shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
          >
            <span>Start Your Free Journey</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        {/* Main Footer Content */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Leaf className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold">PlantCare Pro</span>
                    <p className="text-sm text-green-400">AI-Powered Plant Care</p>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Your AI-powered companion for perfect plant care. Transform your gardening experience with smart technology and expert guidance.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-bold text-lg mb-6 text-white">Features</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-white transition-colors cursor-pointer flex items-center">
                    <Leaf className="w-4 h-4 mr-2 text-green-500" />
                    Smart Care Schedules
                  </li>
                  <li className="hover:text-white transition-colors cursor-pointer flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                    Disease Detection
                  </li>
                  <li className="hover:text-white transition-colors cursor-pointer flex items-center">
                    <Users className="w-4 h-4 mr-2 text-green-500" />
                    Expert Community
                  </li>
                  <li className="hover:text-white transition-colors cursor-pointer flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-green-500" />
                    Learning Center
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-bold text-lg mb-6 text-white">Support</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-white transition-colors cursor-pointer flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Help Center
                  </li>
                  <li className="hover:text-white transition-colors cursor-pointer flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-green-500" />
                    Contact Us
                  </li>
                  <li className="hover:text-white transition-colors cursor-pointer flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-500" />
                    Privacy Policy
                  </li>
                  <li className="hover:text-white transition-colors cursor-pointer flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    Terms of Service
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="font-bold text-lg mb-6 text-white">Contact</h3>
                <div className="space-y-4 text-gray-400">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-green-500" />
                    <span>hello@plantcarepro.com</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-green-500" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-3 text-green-500" />
                    <span>123 Garden Street<br />Plant City, PC 12345</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
                <p>&copy; 2024 PlantCare Pro. All rights reserved. Made with ❤️ for plant lovers.</p>
              </div>
              <div className="flex space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 