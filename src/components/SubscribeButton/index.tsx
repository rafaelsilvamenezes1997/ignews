import { useSession, signIn } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

type SubscribeButtonProps = {
  priceId: string;
};

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const session = useSession();
  async function handleSubscribe() {
    if (session.status !== 'authenticated') {
      signIn('github');
    }
    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error.messsage);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={() => handleSubscribe()}
    >
      Subscribe Now
    </button>
  );
}
