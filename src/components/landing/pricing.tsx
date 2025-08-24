'use client';

import { Check, Star, Zap, Shield, Users, Headphones } from 'lucide-react';

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for casual users and small groups",
    features: [
      "Up to 5 friends",
      "1-on-1 video calls",
      "Basic text messaging",
      "Standard voice quality",
      "Mobile & desktop apps",
      "Community support"
    ],
    limitations: [
      "No group video calls",
      "Limited to 2 hours per call",
      "Basic encryption"
    ],
    popular: false
  },
  {
    name: "Pro",
    price: "9",
    description: "Ideal for active gamers and remote workers",
    features: [
      "Unlimited friends",
      "Group video calls (up to 15)",
      "Screen sharing & recording",
      "HD voice & video quality",
      "Custom emojis & reactions",
      "File sharing (100MB)",
      "Priority support",
      "Advanced encryption",
      "Server creation"
    ],
    limitations: [],
    popular: true
  },
  {
    name: "Team",
    price: "25",
    description: "Built for teams and organizations",
    features: [
      "Everything in Pro",
      "Group video calls (up to 50)",
      "Admin controls & permissions",
      "File sharing (1GB)",
      "Advanced analytics",
      "Custom branding",
      "SSO integration",
      "24/7 dedicated support",
      "API access",
      "Enterprise security"
    ],
    limitations: [],
    popular: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.05),transparent_70%)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-800 mb-6">
            <span className="text-sm font-medium text-zinc-300">Simple, transparent pricing</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-indigo-200 mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-zinc-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Start free and scale as you grow. All plans include our core features 
            with <span className="text-white font-medium">no hidden fees</span> or surprises.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-zinc-900/40 backdrop-blur-md rounded-2xl border p-8 ${
                plan.popular 
                  ? 'border-blue-500/50 ring-1 ring-blue-500/20' 
                  : 'border-zinc-800/80'
              } hover:border-zinc-700/80 transition-all duration-300 group`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-zinc-600 to-zinc-900 text-white text-sm font-medium">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl md:text-5xl font-bold text-white">${plan.price}</span>
                  <span className="text-zinc-400 ml-2">/month</span>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed max-w-xs mx-auto">
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600/20 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-zinc-300 text-sm">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations.map((limitation, limitIndex) => (
                  <div key={limitIndex} className="flex items-start opacity-60">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-zinc-700/20 flex items-center justify-center mr-3 mt-0.5">
                      <div className="w-3 h-3 rounded-full bg-zinc-500" />
                    </div>
                    <span className="text-zinc-400 text-sm">{limitation}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose ConvoX?</h3>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-12">
            Built specifically for gamers and remote workers who demand the best
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/80 text-center group hover:border-zinc-700/80 transition-all duration-300">
              <div className="w-12 h-12  rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Lightning Fast</h4>
              <p className="text-zinc-400 text-sm">
                Ultra-low latency for competitive gaming and real-time collaboration.
              </p>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/80 text-center group hover:border-zinc-700/80 transition-all duration-300">
              <div className="w-12 h-12  rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Secure & Private</h4>
              <p className="text-zinc-400 text-sm">
                End-to-end encryption ensures your conversations stay private.
              </p>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/80 text-center group hover:border-zinc-700/80 transition-all duration-300">
              <div className="w-12 h-12  rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Team-Focused</h4>
              <p className="text-zinc-400 text-sm">
                Perfect for gaming squads, remote teams, and creative collaborations.
              </p>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-md p-6 rounded-2xl border border-zinc-800/80 text-center group hover:border-zinc-700/80 transition-all duration-300">
              <div className="w-12 h-12  rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">24/7 Support</h4>
              <p className="text-zinc-400 text-sm">
                Get help whenever you need it from our dedicated support team.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h3>
            <p className="text-xl text-zinc-300">
              Everything you need to know about ConvoX
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Can I change plans anytime?",
                answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing accordingly."
              },
              {
                question: "Is there a free trial for paid plans?",
                answer: "Absolutely! All paid plans come with a 14-day free trial. No credit card required to start your trial."
              },
              {
                question: "What happens if I exceed my plan limits?",
                answer: "We'll notify you when you're approaching your limits. You can either upgrade your plan or some features may be temporarily limited until the next billing cycle."
              },
              {
                question: "Do you offer student discounts?",
                answer: "Yes! Students get 50% off Pro plans. Contact our support team with your student ID for verification."
              },
              {
                question: "Is my data secure?",
                answer: "Absolutely. We use end-to-end encryption for all communications and never store your conversation data on our servers."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-zinc-900/40 backdrop-blur-md rounded-xl border border-zinc-800/80 p-6 hover:border-zinc-700/80 transition-all duration-300">
                <h4 className="text-lg font-semibold text-white mb-3">{faq.question}</h4>
                <p className="text-zinc-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
