import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import PrivateRoute from './components/PrivateRoute';


const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
