import ReactDOM from "react-dom";
import App from "./App";
import { Route, Link, Routes, BrowserRouter } from "react-router-dom";
import SuccessPage from "./SuccessPage";
import React from "react";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/success" element={<SuccessPage />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
