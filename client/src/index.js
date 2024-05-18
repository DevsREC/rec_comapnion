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

import ReactGa from 'react-ga';


const TRACKING_ID = 'G-CEG1ETDGYE';

ReactGa.initialize(TRACKING_ID);

import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
} from "react-router-dom";
import Rec360 from "./pages/rec360/Rec360";
import AboutUs from "./pages/AboutUs/AboutUs";
import RecTransport from "./pages/RecTransport/RecTransport";
import NavbarBottom from "./components/NavbarBottom/NavbarBottom";
import MarksPage from "./pages/MarksPage/MarksPage";
import ClubHub from "./pages/ClubHub/ClubHub";
import Dineout from "./pages/Dineout/Dineout";
import Attendance from "./pages/Attendance";

// caches.open("pwa-assets")
// .then(cache => {
//   cache.addAll(["/", "index.js", "index.html", "/static/js/bundle.js", "/home", "manifest.json", "/app"]); // it stores two resources
// });


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
  {
    path: "/attendance",
    element: <Attendance />,
    loader: Audio,
  },
  {
    path: '/mp',
    element: <MarksPage />,
    loader: Audio
  },
  {
    path: '/rec360',
    element: <Rec360 />,
    loader: Audio
  },
  {
    path: '/aboutus',
    element: <AboutUs />,
    loader: Audio
  },
  {
    path: '/transport',
    element: <RecTransport />,
    loader: Audio
  },
  {
    path: '/clubhub',
    element: <ClubHub />,
    loader: Audio
  },
  {
    path: '/dineout',
    element: <Dineout />,
    loader: Audio
  }
]);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <GoogleOAuthProvider clientId="1096735290601-r734om3lj6l65al5f8gdnbrag3m3cieu.apps.googleusercontent.com">
  <React.StrictMode>
    <NextUIProvider className="dark w-full h-full text-foreground bg-background">
      <main className="dark text-foreground bg-background">
        <RouterProvider router={router} />
      </main>
    </NextUIProvider>
  </React.StrictMode>
    </GoogleOAuthProvider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
