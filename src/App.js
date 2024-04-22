import logo from './logo.svg';
import './App.css';
import LoginPage from "./LoginPage";
import GradeBook from "./GradeBook";

import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';


function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/gradebook" element={<GradeBook />} />
          </Routes>
      </Router>
  );
}

export default App;
