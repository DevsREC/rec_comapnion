import React from "react";

import './Footer.css';
import { Link } from "react-router-dom";

export default function Footer() {
    return(
        <footer className="footer-container">
            <span>Made with 💖 & Code by <i>DEVS</i></span>
            <Link to={'/aboutus'} className="footer-link">About Us</Link>
        </footer>
    )
}