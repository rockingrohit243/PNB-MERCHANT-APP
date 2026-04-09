// # Routing setup
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; 
import TransactionReports from './pages/TransactionReports';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/redirected" element={<AuthCallback />} />

        {/* Protected Routes (Requires Token) */}
        <Route element={<ProtectedRoute />}>
          {/* Add your Layout component inside here if you have a Sidebar */}
          <Route path="/" element={<Dashboard />} />
         
          <Route path="/qr" element={<div>QR Page</div>} />
          <Route path="/settings" element={<div>Settings Page</div>} />
          // inside App.jsx routes array:
          <Route path="/reports" element={<TransactionReports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
