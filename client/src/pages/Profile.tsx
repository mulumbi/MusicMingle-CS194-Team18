import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
	const { currentUser, signOut } = useContext(AuthContext);
	const navigate = useNavigate();
	const [profileDetails, setProfileDetails] = useState();

	useEffect(() => {
		currentUser
			?.getIdToken()
			.then((token) => {
				console.log(token);
				axios
					.get(import.meta.env.VITE_BACKEND_URL + "/profile", {
						headers: {
							authorization: token,
						},
					})
					.then((res) => {
						setProfileDetails(res.data);
					})
					.catch((err) => {
						console.log("CORS error: ", err);
					});
			})
			.catch((err) => {
				console.log("Token err: ", err);
			});
	}, []);
	console.log(profileDetails);
	return (
		<div>
			<h3>Welcome! {currentUser?.email}</h3>
			<p>Sign In Status: {currentUser && "active"}</p>
			<button onClick={signOut}>Sign Out</button>
		</div>
	);
}
export default Profile;
