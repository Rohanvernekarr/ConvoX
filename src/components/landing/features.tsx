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
      <section id="features" className="relative py-24 bg-zinc-950 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-800 mb-6">
              <span className="text-sm font-medium text-zinc-300">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to Stay 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Connected</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Built for gamers and remote workers who need reliable communication without the bloat.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              
              return (
                <div 
                  key={index} 
                  className="group relative p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/80 hover:border-zinc-700/70 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className={`w-14 h-14 bg-gradient-to-br  rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white " />
                  </div>
                  <h3 className="text-lg flex item-center justify-center font-semibold text-white mb-3 relative z-10">{feature.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed relative z-10">{feature.description}</p>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }