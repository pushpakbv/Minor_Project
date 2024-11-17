import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import PrivateRoute from './components/PrivateRoute';
import CreatePost from './pages/CreatePost';


const App = () => {
  return (
    <Router>
      <div className="app">
      <Routes>
      <Route path="/" element={<Feed />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} /> */}
      </Routes>
      </div>
    </Router>
  );
};

export default App;
