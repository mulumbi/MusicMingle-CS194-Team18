import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Gigs from "./pages/Gigs.tsx";
import Gig from "./pages/Gig.tsx";
import Artists from "./pages/Artists.tsx";
import Artist from "./pages/Artist.tsx";
import MyGigs from "./pages/MyGigs.tsx";
import Profile from "./pages/Profile.tsx";
import ProfileSettings from "./pages/ProfileSettings.tsx";
import RequireAuth from "./components/RequireAuth.tsx";
import "./App.css";
import CreateGig from "./pages/CreateGig.tsx";

function App() {
	return (
		<Routes>
			<Route
				index
				element={<Home />}
			/>
			<Route path="gigs">
				<Route
					index
					element={<Gigs />}
				/>
				<Route
					path=":id"
					element={
						<RequireAuth>
							<Gig />
						</RequireAuth>
					}
				/>
			</Route>
			<Route path="artists">
				<Route
					index
					element={<Artists />}
				/>
				<Route
					path=":id"
					element={<Artist />}
				/>
			</Route>
			<Route
				path="my_gigs"
				element={
					<RequireAuth>
						<MyGigs />
					</RequireAuth>
				}
			/>
			<Route
				path="create_gig"
				element={
					<RequireAuth>
						<CreateGig />
					</RequireAuth>
				}
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
				path="profile_settings"
				element={
					<RequireAuth>
						<ProfileSettings />
					</RequireAuth>
				}
			/>
		</Routes>
	);
}

export default App;
