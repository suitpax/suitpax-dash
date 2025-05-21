import { type NextRequest, NextResponse } from "next/server"
import { handleWebhook, syncSubscriptionWithBillingService } from "@/lib/services/stripe-service"

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text()
    const signature = req.headers.get("stripe-signature") || ""

    const event = await handleWebhook(payload, signature)

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        // Handle successful checkout
        const checkoutSession = event.data.object
        console.log("Checkout completed:", checkoutSession)

        // Sync with billing service
        if (checkoutSession.subscription) {
          await syncSubscriptionWithBillingService({
            type: "checkout.completed",
            subscriptionId: checkoutSession.subscription,
            customerId: checkoutSession.customer,
            metadata: checkoutSession.metadata,
          })
        }
        break

      case "customer.subscription.created":
        // Handle subscription creation
        const createdSubscription = event.data.object
        console.log("Subscription created:", createdSubscription)

        // Sync with billing service
        await syncSubscriptionWithBillingService({
          type: "subscription.created",
          subscription: createdSubscription,
        })
        break

      case "customer.subscription.updated":
        // Handle subscription update
        const updatedSubscription = event.data.object
        console.log("Subscription updated:", updatedSubscription)

        // Sync with billing service
        await syncSubscriptionWithBillingService({
          type: "subscription.updated",
          subscription: updatedSubscription,
        })
        break

      case "customer.subscription.deleted":
        // Handle subscription cancellation
        const deletedSubscription = event.data.object
        console.log("Subscription cancelled:", deletedSubscription)

        // Sync with billing service
        await syncSubscriptionWithBillingService({
          type: "subscription.deleted",
          subscription: deletedSubscription,
        })
        break

      case "invoice.payment_succeeded":
        // Handle successful payment
        const invoice = event.data.object
        console.log("Payment succeeded:", invoice)

        // Sync with billing service if this is for a subscription
        if (invoice.subscription) {
          await syncSubscriptionWithBillingService({
            type: "invoice.paid",
            invoiceId: invoice.id,
            subscriptionId: invoice.subscription,
            customerId: invoice.customer,
            amount: invoice.amount_paid,
            currency: invoice.currency,
          })
        }
        break

      case "invoice.payment_failed":
        // Handle failed payment
        const failedInvoice = event.data.object
        console.log("Payment failed:", failedInvoice)

        // Sync with billing service if this is for a subscription
        if (failedInvoice.subscription) {
          await syncSubscriptionWithBillingService({
            type: "invoice.failed",
            invoiceId: failedInvoice.id,
            subscriptionId: failedInvoice.subscription,
            customerId: failedInvoice.customer,
          })
        }
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Error handling webhook:", err)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 })
  }
}

// This is important for Stripe webhooks
export const config = {
  api: {
    bodyParser: false,
  },
}
