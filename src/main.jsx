import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { setAppTitle } from "./lib/appTitle.js";
import About from "./pages/About.jsx";
import AppLayout from "./components/AppLayout.jsx";

const router =  createBrowserRouter([
  {
    path: "/",
    element: (
      <App appName={name}/>
    ),
  },
  {
    path: "about",
    element: (
      <AppLayout>
        <About />
      </AppLayout>
    ),
  },

])

// setting the app title 
// setAppTitle("ServerControl")//Not working 
//I will have to work on this 

createRoot(document.getElementById("ekilie")).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);
