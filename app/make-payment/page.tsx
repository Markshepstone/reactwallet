// File: reactwallet/app/make-payment/page.tsx

import PaymentForm from '/components/PaymentForm';

export default function MakePayment() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Make a Payment</h1>
      <PaymentForm />
    </div>
  );
}