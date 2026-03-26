import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<div className="not-found-page">
			<h1 className="not-found-huge-text">404</h1>

			<h2 className="not-found-subtitle">Page not found</h2>

			<p className="not-found-text">It looks like you got lost.</p>

			<button onClick={() => navigate("/")} className="action-btn btn-primary">
				Take me home
			</button>
		</div>
	);
};

export default NotFound;
