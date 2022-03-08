import React, { useState, useContext, useEffect, useReducer } from "react";

export const MessageContext = React.createContext(null);

const messageReducer = (state, action) => {
	switch (action.type) {
		case "ADD_MESSAGE":
			return [...state, ...action.payload];
		default:
			return [];
	}
};

export function MessageContextProvider({ children }) {
	const [currChannelMessages, dispatch] = useReducer(messageReducer, []);
	const [loadingMessages, setLoadingMessages] = useState(true);

	return (
		<MessageContext.Provider
			value={{
				currChannelMessages,
				dispatch,
				loadingMessages,
				setLoadingMessages,
			}}
		>
			{children}
		</MessageContext.Provider>
	);
}
