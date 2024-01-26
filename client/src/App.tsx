import { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetAllUser from "./components/GetAllUser.tsx";

import "./App.css";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="get"
					element={<GetAllUser />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
