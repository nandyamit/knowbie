import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { Dashboard } from './pages/Dashboard';
import { useAuth } from './hooks/useAuth';

function App() {
 const { user } = useAuth();

 return (
   <Router>
     <Routes>
       <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
       <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/dashboard" />} />
       <Route path="/signup" element={!user ? <SignupForm /> : <Navigate to="/dashboard" />} />
       <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
     </Routes>
   </Router>
 );
}

export default App;