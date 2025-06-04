"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, StarIcon } from "@heroicons/react/24/solid"
import Image from "next/image"

// Títulos alternativos
const titleVariations = [
  "Business travel plans for every team size.",
  "AI-powered travel management for modern businesses.",
  "Flexible plans for your business travel needs.",
  "Scale your travel operations effortlessly.",
  "Travel management that grows with your business.",
  "Simple pricing for powerful travel tools.",
  "Choose the right plan for your business.",
  "Transparent pricing, exceptional value.",
  "Plans designed for modern business travel.",
  "Pricing that scales with your success.",
]

// Subtítulos
const subtitles = [
  "Choose the plan that fits your business travel requirements and team size",
  "Transparent pricing with no hidden fees, designed for business travel",
  "Powerful AI travel agents with plans that scale as your team grows",
  "Enterprise-grade travel management at startup-friendly prices",
]

// Chat placeholders para cada plan
const chatPlaceholders = {
  free: [
    "Help me find a budget hotel in Chicago...",
    "What's the cheapest flight to New York next week?...",
    "Can I book a basic business trip to Dallas?...",
  ],
  basic: [
    "Find me a flight with lounge access to London...",
    "Book a business hotel with meeting rooms in Berlin...",
    "Schedule a team lunch near our client's office in Madrid...",
  ],
  pro: [
    "Arrange travel for our marketing team to Tokyo...",
    "Set up our company travel policy for approval...",
    "Find the best business hotels with executive suites in Singapore...",
  ],
  enterprise: [
    "Coordinate global travel for our executive team...",
    "Analyze our Q2 travel spend and suggest optimizations...",
    "Set up custom approval workflows for our regional offices...",
  ],
}

// Community images
const communityImages = {
  free: ["/images/team/jordan-burgess.jpeg", "/images/team/genevieve-mclean.jpeg"],
  basic: ["/images/team/loki-bright.jpeg", "/images/team/isla-allison.jpeg", "/images/team/isobel-fuller.jpeg"],
  pro: [
    "/images/team/ammar-foley.jpeg",
    "/images/team/aston-hood.jpeg",
    "/images/team/cohen-lozano.jpeg",
    "/images/team/isobel-fuller.jpeg",
  ],
  enterprise: [
    "/images/team/ammar-foley.jpeg",
    "/images/team/aston-hood.jpeg",
    "/images/team/lyle-kauffman.jpeg",
    "/images/team/orlando-diggs.jpeg",
    "/images/team/scott-clayton.jpeg",
    "/images/team/genevieve-mclean.jpeg",
    "/images/team/loki-bright.jpeg",
  ],
}

// Pricing plans
const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "For small business teams getting started with AI travel management",
    price: "€0",
    annualPrice: "€0",
    period: "forever",
    annualPeriod: "forever",
    features: [
      "5,000 AI tokens/month",
      "10 AI travel searches per month",
      "Up to 5 team members",
      "Basic AI travel planning",
      "Email support",
      "Basic expense tracking",
      "Simple itinerary management",
      "Basic travel policy templates",
    ],
    cta: "Get Started",
    badge: "Free",
    popular: false,
    agentImage: "/images/ai-agent-avatar.jpeg",
    communityImages: communityImages.free,
    bgGradient: "from-white/5 to-white/10",
  },
  {
    id: "basic",
    name: "Professional",
    description: "For growing teams ready to optimize their travel experience",
    price: "€49",
    annualPrice: "€39",
    period: "per month",
    annualPeriod: "per month, billed annually",
    features: [
      "15,000 AI tokens/month",
      "30 AI travel searches per month",
      "Up to 15 team members",
      "Standard AI travel planning",
      "Priority email support",
      "Advanced expense tracking",
      "Enhanced itinerary management",
      "Standard travel policy templates",
      "Basic CRM integration",
    ],
    cta: "Start 14-day trial",
    badge: "Most Popular",
    popular: true,
    agentImage: "/images/ai-agent-avatar.jpeg",
    communityImages: communityImages.basic,
    bgGradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    id: "pro",
    name: "Business",
    description: "For businesses ready to fully optimize their travel operations",
    price: "€89",
    annualPrice: "€79",
    period: "per month",
    annualPeriod: "per month, billed annually",
    features: [
      "25,000 AI tokens/month",
      "50 AI travel searches per month",
      "Up to 25 team members",
      "AI-powered expense management",
      "Advanced itinerary planning",
      "Custom travel policies",
      "24/5 priority support",
      "Team travel coordination",
      "Basic bank API integration",
      "Advanced CRM intelligence",
    ],
    cta: "Contact us",
    badge: "Advanced",
    popular: false,
    agentImage: "/images/ai-agent-avatar.jpeg",
    communityImages: communityImages.pro,
    bgGradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Enterprise-grade travel management for global companies",
    price: "Custom Pricing",
    annualPrice: "Custom Pricing",
    period: "tailored for enterprise",
    annualPeriod: "tailored for enterprise",
    features: [
      "Unlimited AI tokens",
      "Unlimited AI travel searches",
      "Unlimited team members",
      "Full AI travel intelligence suite",
      "Enterprise CRM integration",
      "Global travel compliance",
      "24/7 VIP support",
      "Custom AI workflows",
      "Executive travel program",
      "Full bank API integration",
      "Multi-currency management",
    ],
    cta: "Contact us",
    badge: "Enterprise",
    popular: false,
    agentImage: "/images/ai-agent-avatar.jpeg",
    communityImages: communityImages.enterprise,
    bgGradient: "from-amber-500/10 to-orange-500/10",
  },
]

// Mini Chat Component
const MiniChat = ({ planId }: { planId: string }) => {
  const [typedText, setTypedText] = useState("")
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const placeholders = chatPlaceholders[planId as keyof typeof chatPlaceholders] || chatPlaceholders.free

  const getAgentImage = () => {
    return "/images/ai-agent-avatar.jpeg"
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (!isDeleting && typedText.length < placeholders[currentPlaceholder].length) {
      timeout = setTimeout(
        () => {
          setTypedText(placeholders[currentPlaceholder].substring(0, typedText.length + 1))
        },
        50 + Math.random() * 50,
      )
    } else if (!isDeleting && typedText === placeholders[currentPlaceholder]) {
      timeout = setTimeout(() => {
        setIsDeleting(true)
      }, 2000)
    } else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(() => {
        setTypedText(placeholders[currentPlaceholder].substring(0, typedText.length - 1))
      }, 30)
    } else if (isDeleting && typedText === "") {
      setIsDeleting(false)
      setCurrentPlaceholder((currentPlaceholder + 1) % placeholders.length)
    }

    return () => clearTimeout(timeout)
  }, [typedText, isDeleting, currentPlaceholder, placeholders])

  return (
    <div className="relative flex items-center gap-2 p-2 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm text-xs mt-4">
      <div className="relative w-6 h-6 overflow-hidden rounded-full border border-white/20">
        <Image
          src={getAgentImage() || "/placeholder.svg"}
          alt="Agent"
          width={24}
          height={24}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="flex-1 py-1 px-1 text-xs text-white/70 h-6 flex items-center overflow-hidden">
        <span className="inline-block truncate">
          {typedText}
          {!isDeleting && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.7 }}
              className="inline-block w-0.5 h-3 bg-white/50 ml-0.5"
            />
          )}
        </span>
      </div>
    </div>
  )
}

// Community Carousel Component
const CommunityCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="mt-4 relative">
      <p className="text-xs text-white/50 mb-2">Team members using this plan:</p>
      <div className="flex -space-x-2 overflow-hidden">
        {images.slice(0, 5).map((image, index) => (
          <motion.div
            key={index}
            className={`relative w-7 h-7 rounded-full border-2 border-white/20 overflow-hidden ${
              index === currentIndex ? "z-10" : ""
            }`}
            animate={{ scale: index === currentIndex ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt="Team member"
              width={28}
              height={28}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
        {images.length > 5 && (
          <div className="relative w-7 h-7 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-xs font-medium text-white/70">
            +{images.length - 5}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PlansPage() {
  const [randomTitle, setRandomTitle] = useState("")
  const [randomSubtitle, setRandomSubtitle] = useState("")
  const [isAnnual, setIsAnnual] = useState(false)

  useEffect(() => {
    const titleIndex = Math.floor(Math.random() * titleVariations.length)
    setRandomTitle(titleVariations[titleIndex])

    const subtitleIndex = Math.floor(Math.random() * subtitles.length)
    setRandomSubtitle(subtitles[subtitleIndex])
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          className="flex flex-col items-center justify-center text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-3 mb-6 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
              Suitpax Pricing
            </span>
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
              Updated Q1 2025
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-none max-w-5xl mb-6">
            {randomTitle || "Business travel plans for every team size."}
          </h1>
          <p className="text-lg text-white/70 max-w-3xl mb-8">
            {randomSubtitle || "Choose the plan that fits your business travel requirements and team size"}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge className="bg-white/10 text-white border-white/20">Flexible Solutions</Badge>
            <Badge className="bg-white/10 text-white border-white/20">Artificial Intelligence</Badge>
            <Badge className="bg-white/10 text-white border-white/20">Scalability</Badge>
          </div>
        </motion.div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 text-sm rounded-lg transition-all ${
                !isAnnual ? "bg-white/10 text-white font-medium" : "text-white/70"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 text-sm rounded-lg transition-all ${
                isAnnual ? "bg-white/10 text-white font-medium" : "text-white/70"
              }`}
            >
              Annual
              <span className="ml-2 inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              className={`relative overflow-hidden bg-gradient-to-br ${plan.bgGradient} border ${
                plan.popular ? "border-purple-500/50 ring-2 ring-purple-500/20" : "border-white/10"
              } rounded-2xl p-8 flex flex-col h-full backdrop-blur-sm`}
              whileHover={{
                y: -8,
                transition: { duration: 0.2 },
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium px-4 py-1 rounded-full flex items-center">
                    <StarIcon className="h-3 w-3 mr-1" />
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  {!plan.popular && plan.badge && (
                    <Badge className="bg-white/10 text-white border-white/20">{plan.badge}</Badge>
                  )}
                </div>
                <p className="text-white/70 text-sm">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline mb-2">
                  <span className="text-4xl font-bold text-white">{isAnnual ? plan.annualPrice : plan.price}</span>
                  <span className="text-white/70 text-sm ml-2">/{isAnnual ? plan.annualPeriod : plan.period}</span>
                </div>
                {isAnnual && plan.price !== "Custom Pricing" && (
                  <p className="text-emerald-400 text-sm">
                    Save €
                    {(Number.parseInt(plan.price.replace("€", "")) -
                      Number.parseInt(plan.annualPrice.replace("€", ""))) *
                      12}
                    /year
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 bg-emerald-500/20 rounded-full p-1">
                      <CheckIcon className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="text-sm text-white/70">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Mini Chat */}
              <MiniChat planId={plan.id} />

              {/* Community Carousel */}
              <CommunityCarousel images={plan.communityImages} />

              {/* CTA Button */}
              <div className="mt-6">
                <Button
                  className={`w-full py-3 text-sm font-medium transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Token Usage */}
        <motion.div
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">
            AI Token Usage {isAnnual ? "(Annual Plans)" : "(Monthly Plans)"}
          </h3>
          <div className="grid grid-cols-4 gap-6">
            {[
              { name: "Free", tokens: "5K", width: "w-1/5" },
              { name: "Professional", tokens: "15K", width: "w-1/3" },
              { name: "Business", tokens: "25K", width: "w-1/2" },
              { name: "Enterprise", tokens: "Unlimited", width: "w-full" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-full bg-white/10 h-2 mb-3 rounded-full overflow-hidden">
                  <div className={`bg-gradient-to-r from-purple-500 to-pink-500 h-2 ${item.width} rounded-full`}></div>
                </div>
                <p className="text-sm font-medium text-white">{item.name}</p>
                <p className="text-xs text-white/50">{item.tokens} tokens</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Can I change my plan later?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. Changes to your subscription will be prorated and reflected in your next billing cycle.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for Enterprise plans.",
              },
              {
                question: "Is there a free trial?",
                answer:
                  "Yes, you can try the Professional plan for 14 days absolutely free. No credit card required to start your trial.",
              },
              {
                question: "What's included in Enterprise support?",
                answer:
                  "Enterprise plans include a dedicated account manager, 24/7 phone support, custom onboarding, and priority feature requests.",
              },
            ].map((faq, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <h4 className="text-lg font-medium text-white mb-3">{faq.question}</h4>
                  <p className="text-white/70 text-sm">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="mt-20 text-center max-w-3xl mx-auto bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">Need a custom solution?</h3>
          <p className="text-white/70 mb-6">
            Our enterprise plans are tailored to your specific business travel needs. Contact our sales team to learn
            more about how we can customize a solution for your organization.
          </p>
          <Button className="bg-white text-black hover:bg-white/90 px-8 py-3">
            Contact our sales team
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
