import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { TripProvider } from './hooks/useTrip';
import Allroutes from './routes/Allroutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
          <Allroutes />
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
