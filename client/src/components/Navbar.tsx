import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { signInWithGooglePopup } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
	const navigate = useNavigate();
	const { currentUser, signOut } = useContext(AuthContext);

	return (
		<nav>
			<button
				type="submit"
				onClick={() => navigate("/")}
			>
				Home
			</button>
			<button
				type="submit"
				onClick={() => navigate("/profile")}
			>
				Profile
			</button>
			<button
				type="submit"
				onClick={() => navigate("/events_list")}
			>
				Events List
			</button>
			<button
				type="submit"
				onClick={() => {
					!!currentUser ? signOut() : signInWithGooglePopup();
				}}
			>
				{!!currentUser ? "Sign Out" : "Sign In"}
			</button>
		</nav>
	);
};

export default Navbar;
