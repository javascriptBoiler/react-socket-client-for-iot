import React, { useState, useEffect} from "react";
import {
  BrowserRouter as AppRouter,
  Routes,
  Route,
} from "react-router-dom";
import io from "socket.io-client";
import { ToastContainer } from 'react-toastify';

import config from "./config";

import Home from "./pages/Home";
import CreatePage from "./pages/CreateMeasure";
import 'react-toastify/dist/ReactToastify.css';

const Router = () =>{
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(config.BASE_URL);
    setSocket(newSocket);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "auto",
        textAlign: "center",
        background: "#4fc6db",
      }}
    >
      <div className="header">
        <span>IOT Device Monitoring</span>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AppRouter>
        <Routes>
          <Route path="/" element={<Home socket={socket} />} />
          <Route path="/create" element={<CreatePage socket={socket} />} />
        </Routes>
      </AppRouter>
    </div>
  );
}

export default Router;
