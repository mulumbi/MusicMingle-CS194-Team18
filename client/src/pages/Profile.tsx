import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
	const { currentUser, signOut } = useContext(AuthContext);
	const navigate = useNavigate();

	return (
		<div>
			<h3>Welcome! {currentUser?.email}</h3>
			<p>Sign In Status: {currentUser && "active"}</p>
			<button onClick={signOut}>Sign Out</button>
		</div>
	);
}
export default Profile;
