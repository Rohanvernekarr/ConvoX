import { 
    Zap, 
    Shield, 
    Smartphone, 
    Cloud, 
    Users, 
    MessageCircle,
    Video,
    Headphones 
  } from 'lucide-react';
  
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for background operation with minimal resource usage. Wont slow down your games or work.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'End-to-end encryption for all calls and messages. Your conversations stay private.',
    },
    {
      icon: Smartphone,
      title: 'Cross-Platform',
      description: 'Works seamlessly across desktop, mobile, and tablet. Stay connected anywhere.',
    },
    {
      icon: Cloud,
      title: 'Cloud Sync',
      description: 'All your chats and contacts synced across devices. Never lose a conversation.',
    },
    {
      icon: Users,
      title: 'Friend System',
      description: 'Add friends by username or link. Send requests and build your network easily.',
    },
    {
      icon: Video,
      title: 'HD Video Calls',
      description: 'Crystal clear video calls with up to 50 participants in group calls.',
    },
    {
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Instant messaging with file sharing, emojis, and rich text formatting.',
    },
    {
      icon: Headphones,
      title: 'Voice Channels',
      description: 'Create persistent voice channels for your gaming sessions or work meetings.',
    },
  ];
  
  export function Features() {
    return (
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Connected
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for gamers and remote workers who need reliable communication without the bloat.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  