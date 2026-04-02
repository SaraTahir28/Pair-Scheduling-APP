import React from "react";
const NotFound = () => {
	return (
		<div className="not-found-page">
			<h1 className="not-found-huge-text">404</h1>

			<h2 className="not-found-subtitle">Page not found</h2>

			<p className="not-found-text">It looks like you got lost.</p>

			<a href="/" className="action-btn btn-primary">
				Take me home
			</a>
		</div>
	);
};

export default NotFound;
