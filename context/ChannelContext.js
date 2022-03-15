import React, { useEffect, useState, useContext, useReducer } from "react";
import { ServerContext } from "./ServerContext";
import { TextileContext } from "./TextileContext";

const channelReducer = (state, action) => {
	switch (action.type) {
		case "ADD_CHANNEL":
			return [...state, ...action.payload];
		case "INITIAL_STATE":
		default:
			return [];
	}
};

export const ChannelContext = React.createContext(null);

export function ChannelContextProvider({ children }) {
	const { selectedServer } = useContext(ServerContext);
	const { getChannelById } = useContext(TextileContext);
	const [channels, dispatch] = useReducer(channelReducer, []);
	const [selectedChannel, setSelectedChannel] = useState(null);
	const [loadingChannel, setLoadingChannel] = useState(true);

	return (
		<ChannelContext.Provider
			value={{
				selectedChannel,
				channels,
				setSelectedChannel,
				loadingChannel,
				dispatch,
				setLoadingChannel,
			}}
		>
			{children}
		</ChannelContext.Provider>
	);
}
