import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';


import Header from './components/Header';
import Footer from './components/Footer';


import Dashboard from './pages/Dashboard';
import EmailDetails from './pages/EmailDetails';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/email/:id" element={<EmailDetails />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
