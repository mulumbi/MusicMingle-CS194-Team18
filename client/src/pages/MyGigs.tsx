import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MyGigs() {
	return (
		/**
		 * Extract the currrentUser from the context, if you want to
		 * get the User info, like the email, display name, etc.
		 */
		<div>
			<h1>MyGigs List</h1>
		</div>
	);
}
export default MyGigs;
