import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

const formatAmountForStripe = (amount) => {
    return Math.round(amount * 100)
}


export async function GET(req) {
    const searchParams = req.nextUrl.searchParams
    const session_id = searchParams.get('session_id')

    try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id)
        return NextResponse.json(checkoutSession)
    } catch (e) {
        console.error('Error retrieving checkout session', e)
        return NextResponse.json({ error: {message: e.message}}, {status: 500})
    }
}

export async function POST(req) {
    
    const { plan } = await req.json()

    let price;
    if (plan === 'basic') {
        price = formatAmountForStripe(4.99)
    } else if (plan === 'pro') {
        price = formatAmountForStripe(9.99)
    } else {
        return NextResponse.json({ error: { message: 'invalid plan' } }, { status: 400 })
    }

    const params = {
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
        {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: plan === 'pro' ? 'Pro Subscription' : 'Basic Subscription',
                },
                unit_amount: price,
                recurring: {
                    interval: 'month',
                    interval_count: 1,
                }
            },
            quantity: 1
        },
        ],
        success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
    };
    const checkoutSession = await stripe.checkout.sessions.create(params);
    
    return NextResponse.json(checkoutSession, {
        status: 200,
    })
}