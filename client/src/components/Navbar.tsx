import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { signInWithGooglePopup } from "../firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import LogoLight from "../assets/LogoLight.png";
import ChatIcon from "../assets/Chat.png";
import NotificationsIcon from "../assets/Notification.png";
import UserIcon from "../assets/User.png";

const Navbar = () => {
    const navigate = useNavigate();
    const { currentUser, signOut } = useContext(AuthContext);
	const pathname = useLocation().pathname;

    return (
        <nav className="navbar">
            <div className="navbar-group">
                <button className="navbar-logo" onClick={() => navigate("/")}>
                    <img src={LogoLight} alt="Logo" />
                </button>
                <div className="navbar-separator"></div>
                <button className={"navbar-item " + (pathname === "/" ? 'active' : '')} onClick={() => navigate("/")}>
                    Home
                </button>
                <button className={"navbar-item " + (pathname === "/gigs" ? 'active' : '')} onClick={() => navigate("/gigs")}>
                    View Gigs
                </button>
                <button className={"navbar-item " + (pathname === "/artists" ? 'active' : '')} onClick={() => navigate("/artists")}>
                    View Artists
                </button>
                <button className={"navbar-item " + (pathname === "/my_gigs" ? 'active' : '')} onClick={() => navigate("/my_gigs")}>
                    My Gigs
                </button>
            </div>
            <div className="navbar-actions">
                { !!currentUser && 
                    <div>
                        <button className="navbar-action" onClick={() => navigate("/")}>
                            <img src={ChatIcon} alt="Chats" />
                        </button>
                        <button className="navbar-action" onClick={() => navigate("/")}>
                            <img src={NotificationsIcon} alt="Notifications" />
                        </button>
                        <button className="navbar-action" onClick={() => navigate("/profile")}>
                            <img src={UserIcon} alt="Profile" />
                        </button>
                    </div>
                }
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
