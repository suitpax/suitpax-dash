import Stripe from "stripe"

// Initialize Stripe with the API key
const stripeApiKey = process.env.STRIPE_API_KEY
if (!stripeApiKey) {
  throw new Error("Missing STRIPE_API_KEY environment variable")
}

const stripe = new Stripe(stripeApiKey, {
  apiVersion: "2023-10-16",
})

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
    // In a real implementation, you would fetch the price ID
    // based on the planName from your database or Stripe.
    const priceId = "price_1NVEym2eZvKYlo2C3bkIIjpl" // Example price ID

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
