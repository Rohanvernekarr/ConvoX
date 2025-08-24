'use client';

import { 
  Shield, 
  Zap, 
  Users, 
  Heart,
  Target,
  Award
} from 'lucide-react';


export function AboutSection() {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.05),transparent_70%)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-800 mb-6">
            <span className="text-sm font-medium text-zinc-300">About ConvoX</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-indigo-200 mb-6">
            Built for Creators,<br />By Creators
          </h2>
          <p className="text-xl text-zinc-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            We understand the struggle of staying connected while pursuing your passions. 
            <span className="text-white font-medium"> ConvoX</span> was born from the need for 
            seamless communication that doesn't interrupt your flow.
          </p>
        </div>

        {/* Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
            <p className="text-zinc-300 text-lg leading-relaxed">
              To create the most intuitive and lightweight communication platform 
              that enhances productivity without being disruptive.
            </p>
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/80 group hover:border-zinc-700/80 transition-all duration-300">
              <div className="w-12 h-12  rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Purpose-Built</h4>
              <p className="text-zinc-400 text-sm">
                Every feature designed with gamers and remote workers in mind.
              </p>
            </div>
            
            <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/80 group hover:border-zinc-700/80 transition-all duration-300">
              <div className="w-12 h-12  rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Lightning Fast</h4>
              <p className="text-zinc-400 text-sm">
                Minimal latency, maximum performance, zero interruptions.
              </p>
            </div>
            
            <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/80 group hover:border-zinc-700/80 transition-all duration-300">
              <div className="w-12 h-12  rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Privacy First</h4>
              <p className="text-zinc-400 text-sm">
                End-to-end encryption and complete data ownership.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Values</h3>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-12">
            The principles that guide every decision we make
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="w-16 h-16  rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Community</h4>
              <p className="text-zinc-400 text-sm">
                Building connections that matter, fostering relationships that last.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16  rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Empathy</h4>
              <p className="text-zinc-400 text-sm">
                Understanding our users' needs and designing solutions that truly help.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16  rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Excellence</h4>
              <p className="text-zinc-400 text-sm">
                Pursuing the highest quality in everything we create and deliver.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16  rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Innovation</h4>
              <p className="text-zinc-400 text-sm">
                Constantly pushing boundaries to create better experiences.
              </p>
            </div>
          </div>
        </div>

       
      </div>
    </section>
  );
}
