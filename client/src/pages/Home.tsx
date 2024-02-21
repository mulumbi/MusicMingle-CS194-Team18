import { FormEvent, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { signInWithGooglePopup } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import ".././App.css";

function Home() {
	const navigate = useNavigate();
	const { currentUser } = useContext(AuthContext);

	return (
		<div className="App">
			<h1>Home</h1>
		</div>
	);
}

export default Home;