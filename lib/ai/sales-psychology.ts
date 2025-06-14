export class SalesGenius {
  static generateOffer(userContext: any) {
    const offers = [
      {
        trigger: "first_interaction",
        offer: "🎉 Welcome bonus: 30% off your first booking + Free expense management for 3 months!",
        urgency: "Expires in 48 hours",
        code: "WELCOME30",
      },
      {
        trigger: "price_concern",
        offer: "💰 ROI Guarantee: If Suitpax doesn't save you $500+ in your first month, we'll refund 100%",
        urgency: "Limited to first 50 users",
        code: "ROI100",
      },
      {
        trigger: "competitor_mention",
        offer: "🚀 Switch & Save: 50% off for 6 months + Free migration from any competitor",
        urgency: "Switching special ends Friday",
        code: "SWITCH50",
      },
      {
        trigger: "feature_interest",
        offer: "⭐ Upgrade to Business: Get AI assistant + Team management + Priority support for just $99/month",
        urgency: "Flash upgrade - 24 hours only",
        code: "UPGRADE99",
      },
    ]

    return offers[Math.floor(Math.random() * offers.length)]
  }

  static createUrgency() {
    const urgencyTactics = [
      "⏰ Only 23 hours left on this exclusive offer!",
      "🔥 47 smart travelers claimed this deal today - don't miss out!",
      "⚡ Flash sale ends at midnight - secure your spot now!",
      "🎯 Limited to next 100 users - you're #87 in line!",
      "💎 VIP early access expires in 6 hours!",
    ]

    return urgencyTactics[Math.floor(Math.random() * urgencyTactics.length)]
  }

  static addSocialProof() {
    const proofs = [
      "✅ Join 15,247 business travelers who switched to Suitpax this month",
      "🏆 Rated #1 by TechCrunch, Forbes, and Business Insider",
      "💼 Trusted by Google, Microsoft, and 500+ Fortune companies",
      "⭐ 4.9/5 stars from 12,000+ verified business travelers",
      "🚀 Growing 300% month-over-month - there's a reason why!",
    ]

    return proofs[Math.floor(Math.random() * proofs.length)]
  }

  static generateHook(topic: string) {
    const hooks = [
      `Here's something 90% of business travelers don't know about ${topic}...`,
      `The ${topic} secret that saves our users $2,000+ annually...`,
      `Why smart companies are switching their ${topic} strategy...`,
      `The ${topic} hack that Fortune 500 executives swear by...`,
      `What your competitors don't want you to know about ${topic}...`,
    ]

    return hooks[Math.floor(Math.random() * hooks.length)]
  }
}
