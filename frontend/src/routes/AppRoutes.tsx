import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
// import ContactPage from '../pages/ContactPage';
// import AuthPage from '../pages/AuthPage';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/contact" element={<ContactPage />} /> */}
      {/* <Route path="/auth" element={<AuthPage />} /> */}
    </Routes>
  </Router>
);

export default AppRoutes;
