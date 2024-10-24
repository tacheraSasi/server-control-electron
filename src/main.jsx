import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router =  createBrowserRouter([
  {
    path: "/",
    element: (
      <App appName={name}/>
    ),
  },
  {
    path: "about",
    element: <div>About</div>,
  },

])

createRoot(document.getElementById("ekilie")).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
);
