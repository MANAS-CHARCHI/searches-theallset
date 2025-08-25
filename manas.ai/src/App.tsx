import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import EmailWriter from "./pages/emailWriter";
import Search from "./pages/search";

function App() {
  return (
    <Router>
      <Header />
      <Sidebar />
      <main className="sm:pt-16 pt-12 lg:ml-44 p-6">
        <Routes>
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path="/search" element={<Search />} />

          <Route path="/email-writer" element={<EmailWriter />} />
          <Route
            path="/clean-message-writer"
            element={<div>Clean Message Writer Page</div>}
          />
          <Route
            path="/search-wikipedia"
            element={<div>Search Wikipedia Page</div>}
          />
          <Route
            path="/write-quick-code"
            element={<div>Write Quick Code Page</div>}
          />
          <Route path="/contribution" element={<div>Contribution Page</div>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
