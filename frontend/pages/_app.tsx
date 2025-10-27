import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import { AuthProvider } from '../context/AuthContext';

// Dynamically import the client-only router to avoid importing react-router on the server
const ClientRouter = dynamic(() => import('../components/ClientRouter'), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClientRouter>
      <AuthProvider>
        <Component {...pageProps} />
        <ToastContainer />
      </AuthProvider>
    </ClientRouter>
  );
}
