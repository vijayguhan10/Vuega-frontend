import { BrowserRouter } from 'react-router-dom';
import Allroutes from './routes/Allroutes';

export default function App() {
  return (
    <BrowserRouter>
      <Allroutes />
    </BrowserRouter>
  );
}
