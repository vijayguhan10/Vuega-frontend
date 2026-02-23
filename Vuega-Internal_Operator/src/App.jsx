import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Allroutes from './routes/Allroutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Allroutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
