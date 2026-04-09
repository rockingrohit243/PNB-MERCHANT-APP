// # Routing setup
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import TransactionReports from './pages/TransactionReports';
import QrDetails from './pages/QrDetails';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/redirected" element={<AuthCallback />} />

        {/* Protected Routes (Requires Token) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/qr" element={<QrDetails />} />
          <Route path="/settings" element={<div>Settings Page</div>} />
          <Route path="/reports" element={<TransactionReports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
