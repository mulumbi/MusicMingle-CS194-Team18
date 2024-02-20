import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { signInWithGooglePopup } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import LogoLight from "../assets/LogoLight.png";
import ChatIcon from "../assets/Chat.png";
import NotificationsIcon from "../assets/Notification.png";
import UserIcon from "../assets/User.png";

const Navbar = () => {
    const navigate = useNavigate();
    const { currentUser, signOut } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="navbar-group">
                <button className="navbar-logo" onClick={() => navigate("/")}>
                    <img src={LogoLight} alt="Logo" />
                </button>
                <div className="navbar-separator"></div>
                <button className="navbar-item active" onClick={() => navigate("/")}>
                    Home
                </button>
                <button className="navbar-item" onClick={() => navigate("/events_list")}>
                    View Gigs
                </button>
                <button className="navbar-item" onClick={() => navigate("/events_list")}>
                    View Artists
                </button>
                <button className="navbar-item" onClick={() => navigate("/events_list")}>
                    My Gigs
                </button>
            </div>
            <div className="navbar-actions">
                <button className="navbar-action" onClick={() => navigate("/profile")}>
                    <img src={ChatIcon} alt="Chats" />
                </button>
                <button className="navbar-action" onClick={() => navigate("/profile")}>
                    <img src={NotificationsIcon} alt="Notifications" />
                </button>
                <button className="navbar-action" onClick={() => navigate("/profile")}>
                    <img src={UserIcon} alt="Profile" />
                </button>
                <button className="navbar-sign" onClick={() => {
                    !!currentUser ? signOut() : signInWithGooglePopup();
                }}>
                    {!!currentUser ? "Sign Out" : "Sign In"}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
