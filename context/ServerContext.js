import React, { useState } from "react";

export const ServerContext = React.createContext(null);

export function ServerContextProvider({ children }) {
	const [Servers, setServers] = useState([]);
	const [selectedServer, setSelectedServer] = useState(null);

	return (
		<ServerContext.Provider
			value={{ Servers, selectedServer, setSelectedServer, setServers }}
		>
			{children}
		</ServerContext.Provider>
	);
}
