// # Routing setup
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import TransactionReports from './pages/TransactionReports';
import QrDetails from './pages/QrDetails';
import LanguageUpdate from './pages/LanguageUpdate';
import HelpAndSupport from './pages/HelpAndSupport';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/redirected" element={<AuthCallback />} />
        <Route path="/help" element={<HelpAndSupport />} /> {/*As this was mising in figma so i have added a coming soon page */}

        {/* Protected Routes (Requires Token)  */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reports" element={<TransactionReports />} />
          <Route path="/qr" element={<QrDetails />} />
          <Route path="/language" element={<LanguageUpdate />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
