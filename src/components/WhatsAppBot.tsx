import React, { useState } from 'react';
import { 
  Bot, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Users, 
  Zap,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

const WhatsAppBot: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const botStats = [
    { title: 'Active Users', value: '1,247', change: '+12%', icon: Users },
    { title: 'Messages Sent', value: '8,943', change: '+23%', icon: MessageSquare },
    { title: 'Response Rate', value: '94.2%', change: '+5%', icon: BarChart3 },
    { title: 'Avg Response Time', value: '2.3s', change: '-15%', icon: Zap },
  ];

  const automations = [
    {
      id: 1,
      name: 'Welcome Message',
      trigger: 'User sends first message',
      status: 'active',
      responses: 342,
      description: 'Greets new users and provides plant care menu options'
    },
    {
      id: 2,
      name: 'Plant Identification',
      trigger: 'User sends plant photo',
      status: 'active',
      responses: 156,
      description: 'Identifies plant species and provides basic care instructions'
    },
    {
      id: 3,
      name: 'Watering Reminders',
      trigger: 'Scheduled daily at 9 AM',
      status: 'paused',
      responses: 89,
      description: 'Sends personalized watering reminders based on user\'s plants'
    },
    {
      id: 4,
      name: 'Care Tips',
      trigger: 'User asks for plant care advice',
      status: 'active',
      responses: 234,
      description: 'Provides seasonal care tips and troubleshooting guidance'
    },
  ];

  const recentConversations = [
    {
      id: 1,
      user: '+1 (555) 123-4567',
      lastMessage: 'My snake plant leaves are turning yellow',
      timestamp: '2 min ago',
      status: 'responded'
    },
    {
      id: 2,
      user: '+1 (555) 987-6543',
      lastMessage: 'When should I repot my monstera?',
      timestamp: '15 min ago',
      status: 'pending'
    },
    {
      id: 3,
      user: '+1 (555) 456-7890',
      lastMessage: 'Thank you for the care tips!',
      timestamp: '1 hour ago',
      status: 'completed'
    },
  ];

  return (
    <div className="space-y-6 mt-16 lg:mt-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">WhatsApp Bot</h1>
            <p className="text-gray-600">Automate plant care assistance via WhatsApp</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Automation</span>
          </button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'automations', name: 'Automations', icon: Zap },
              { id: 'conversations', name: 'Conversations', icon: MessageSquare },
              { id: 'settings', name: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {botStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-gray-50 p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-6 h-6 text-gray-600" />
                        <span className={`text-sm font-medium ${
                          stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                    </div>
                  );
                })}
              </div>

              {/* Activity Chart Placeholder */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Activity</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Activity chart would be displayed here</p>
                    <p className="text-sm">Integration with analytics service required</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'automations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Bot Automations</h3>
                <p className="text-sm text-gray-600">{automations.length} automations configured</p>
              </div>

              <div className="space-y-4">
                {automations.map((automation) => (
                  <div key={automation.id} className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{automation.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            automation.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {automation.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{automation.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Trigger: {automation.trigger}</span>
                          <span>•</span>
                          <span>{automation.responses} responses</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className={`p-2 rounded-lg transition-colors ${
                          automation.status === 'active'
                            ? 'text-yellow-600 hover:bg-white'
                            : 'text-green-600 hover:bg-white'
                        }`}>
                          {automation.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button className="p-2 text-red-600 hover:bg-white rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'conversations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Conversations</h3>
                <select className="px-3 py-2 border border-gray-300 rounded-lg">
                  <option>All conversations</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="space-y-4">
                {recentConversations.map((conversation) => (
                  <div key={conversation.id} className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{conversation.user}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            conversation.status === 'responded' 
                              ? 'bg-green-100 text-green-800'
                              : conversation.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {conversation.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{conversation.lastMessage}</p>
                        <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                      </div>
                      
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        View Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Bot Configuration</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4">WhatsApp Connection</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">API Token</label>
                      <input
                        type="password"
                        placeholder="Enter your WhatsApp Business API token"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Connect WhatsApp
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-4">Bot Behavior</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Auto-respond to messages</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Send daily reminders</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Collect user feedback</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Response delay (seconds)</label>
                      <input
                        type="number"
                        defaultValue="2"
                        min="0"
                        max="30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBot;