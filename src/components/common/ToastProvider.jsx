import { Toaster } from 'react-hot-toast';

/**
 * Wrap this once near the root (App.jsx) so toasts can pop anywhere.
 */
const ToastProvider = () => <Toaster position="top-center" reverseOrder={false} />;

export default ToastProvider;
