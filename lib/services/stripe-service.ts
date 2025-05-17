import Stripe from "stripe"

// Initialize Stripe with the provided API key
const stripe = new Stripe(process.env.STRIPE_API_KEY || "", {
  apiVersion: "2023-10-16",
})

// Billing service URL for external billing service integration
const BILLING_SERVICE_URL = process.env.BILLING_SERVICE_URL || "http://localhost:5012"

export async function createCheckoutSession(params: {
  priceId: string
  successUrl: string
  cancelUrl: string
  customerId?: string
  metadata?: Record<string, string>
}) {
  const { priceId, successUrl, cancelUrl, customerId, metadata } = params

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer: customerId,
    metadata,
  })

  return session
}

export async function createCustomer(params: {
  email: string
  name?: string
  metadata?: Record<string, string>
}) {
  const { email, name, metadata } = params

  const customer = await stripe.customers.create({
    email,
    name,
    metadata,
  })

  return customer
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

export async function updateSubscription(
  subscriptionId: string,
  params: {
    priceId?: string
    metadata?: Record<string, string>
  },
) {
  const { priceId, metadata } = params

  let subscription

  if (priceId) {
    subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Update the subscription items with the new price
    subscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
      metadata,
    })
  } else {
    subscription = await stripe.subscriptions.update(subscriptionId, {
      metadata,
    })
  }

  return subscription
}

export async function createPortalSession(params: {
  customerId: string
  returnUrl: string
}) {
  const { customerId, returnUrl } = params

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function handleWebhook(payload: string, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error("Missing Stripe webhook secret")
  }

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)

    return event
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    throw new Error("Webhook signature verification failed")
  }
}

// Function to communicate with external billing service
export async function syncSubscriptionWithBillingService(subscriptionData: any) {
  try {
    const response = await fetch(`${BILLING_SERVICE_URL}/api/subscriptions/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUITPAX_API_KEY}`,
      },
      body: JSON.stringify(subscriptionData),
    })

    if (!response.ok) {
      throw new Error(`Billing service responded with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error syncing with billing service:", error)
    throw error
  }
}

// Function to get available plans from Stripe
export async function getAvailablePlans() {
  try {
    // Get all active products
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    })

    // Map products to plans with pricing information
    const plans = products.data.map((product) => {
      const price = product.default_price as Stripe.Price

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        priceId: price?.id,
        unitAmount: price?.unit_amount,
        currency: price?.currency,
        interval: price?.type === "recurring" ? price.recurring?.interval : "one-time",
        features: product.features?.map((feature) => feature.name) || [],
        metadata: product.metadata,
      }
    })

    return plans
  } catch (error) {
    console.error("Error fetching plans from Stripe:", error)
    throw error
  }
}
