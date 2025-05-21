import Stripe from "stripe"

// Initialize Stripe with the API key
const stripeApiKey = process.env.STRIPE_API_KEY
if (!stripeApiKey) {
  console.warn("Missing STRIPE_API_KEY environment variable")
}

// Inicializar Stripe solo si la API key está disponible
const stripe = stripeApiKey
  ? new Stripe(stripeApiKey, {
      apiVersion: "2023-10-16",
    })
  : null

interface CreateCheckoutSessionArgs {
  planName: string
  customerId: string
  successUrl: string
  cancelUrl: string
}

export async function createCheckoutSession({
  planName,
  customerId,
  successUrl,
  cancelUrl,
}: CreateCheckoutSessionArgs): Promise<Stripe.Checkout.Session> {
  try {
    if (!stripe) {
      throw new Error("Stripe is not initialized. Missing API key.")
    }

    // Map plan names to price IDs
    // In a real implementation, you would fetch these from your database
    const priceIds: Record<string, string> = {
      starter: "price_starter123",
      pro: "price_pro456",
      enterprise: "price_enterprise789",
    }

    const priceId = priceIds[planName.toLowerCase()] || "price_starter123"

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: customerId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planName: planName,
      },
    })

    return session
  } catch (error) {
    console.error("Error creating checkout session:", error)
    throw error
  }
}

interface CreatePortalSessionArgs {
  customerId: string
  returnUrl: string
}

export async function createPortalSession({
  customerId,
  returnUrl,
}: CreatePortalSessionArgs): Promise<Stripe.BillingPortal.Session> {
  try {
    if (!stripe) {
      throw new Error("Stripe is not initialized. Missing API key.")
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return portalSession
  } catch (error) {
    console.error("Error creating portal session:", error)
    throw error
  }
}

export async function handleWebhook(payload: string, signature: string): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable")
  }

  if (!stripe) {
    throw new Error("Stripe is not initialized. Missing API key.")
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message)
    throw err
  }

  return event
}

const suitpaxApiKey = process.env.SUITPAX_API_KEY || ""
const billingServiceUrl = process.env.BILLING_SERVICE_URL || "http://localhost:5012"

export async function syncSubscriptionWithBillingService(payload: any) {
  try {
    const response = await fetch(`${billingServiceUrl}/api/stripe/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": suitpaxApiKey,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Failed to sync with billing service: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error syncing with billing service:", error)
    throw error
  }
}
