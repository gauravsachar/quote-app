import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import QuoteList from "./components/Quotelist";
import CreateQuote from "./components/CreateQuote";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/quote-list" element={<QuoteList />} />
        <Route path="/create-quote" element={<CreateQuote />} />
      </Routes>
    </Router>
  );
};

export default App;
