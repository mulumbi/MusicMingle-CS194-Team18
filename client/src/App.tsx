import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Profile from "./pages/Profile.tsx";
import EventsList from "./pages/EventsList.tsx";
import RequireAuth from "./components/RequireAuth.tsx";

import "./App.css";

function App() {
	return (
		<Routes>
			<Route
				index
				element={<Home />}
			/>
			<Route
				path="profile"
				element={
					<RequireAuth>
						<Profile />
					</RequireAuth>
				}
			/>
			<Route
				path="events_list"
				element={<EventsList />}
			/>
		</Routes>
	);
}

export default App;
