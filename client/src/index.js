import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { NextUIProvider } from "@nextui-org/react";
import { GoogleOAuthProvider } from '@react-oauth/google';

import Login from "./pages/Login";
import Home from "./pages/Home";
import Marks from "./pages/Marks";
import Grade from "./pages/Grade";

import { Audio } from "react-loader-spinner";

import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    loader: Audio,
  },
  {
    path: "/login",
    element: <Login />,
    loader: Audio,
  },
  {
    path: "/home",
    element: <Home />,
    loader: Audio,
  },
  {
    path: "/marks",
    element: <Marks />,
    loader: Audio,
  },
  {
    path: "/grade",
    element: <Grade />,
    loader: Audio,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <GoogleOAuthProvider clientId="1096735290601-r734om3lj6l65al5f8gdnbrag3m3cieu.apps.googleusercontent.com">
  <React.StrictMode>
    <NextUIProvider className="dark h-full w-full text-foreground bg-background">
      <main className="dark text-foreground bg-background w-full h-full">
        <RouterProvider router={router} />
      </main>
    </NextUIProvider>
  </React.StrictMode>
    </GoogleOAuthProvider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
