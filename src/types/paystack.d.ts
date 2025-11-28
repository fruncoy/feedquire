declare module '@paystack/inline-js' {
  interface PaystackOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    container?: string;
    metadata?: Record<string, any>;
    onSuccess?: (transaction: any) => void;
    onCancel?: () => void;
    onError?: (error: any) => void;
  }

  export default class PaystackPop {
    newTransaction(options: PaystackOptions): void;
  }
}