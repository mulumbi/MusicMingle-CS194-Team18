import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Gigs from "./pages/Gigs.tsx";
import Artists from "./pages/Artists.tsx";
import MyGigs from "./pages/MyGigs.tsx";
import Profile from "./pages/Profile.tsx";
import RequireAuth from "./components/RequireAuth.tsx";

import "./App.css";
import ArtistsList from "./pages/ArtistsList.tsx";

function App() {
	return (
		<Routes>
			<Route
				index
				element={<Home />}
			/>
			<Route
				path="gigs"
				element={<Gigs />}
			/>
			<Route
				path="artists"
				element={<Artists />}
			/>
			<Route
				path="my_gigs"
				element={<MyGigs />}
			/>
			<Route
				path="profile"
				element={
					<RequireAuth>
						<Profile />
					</RequireAuth>
				}
			/>
		</Routes>
	);
}

export default App;
