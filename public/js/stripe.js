import axios from "axios"
import { showAlert } from "./alerts"
const stripe = Stripe('pk_test_51U7d4MHWpbGXNWcAinD5wXYVjVulzdOAtrvZxhqG1uVVYIDa7ZYpbedfmHHRa45DjKL6eFfkYeGBrKsrHTotR2vc002Iw8Vzfa')

export const bookTour = async tourId => {
    try {
        // 1) Get checkout session form API
        const session = await axios(`http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
        );
        console.log(session);

        // 2) Create checkout form + change credit card 
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch (err) {
        console.log(err);
        showAlert('error', err)
    }
}