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
	const [loadingChannel, setLoadingChannel] = useState(false);

	useEffect(async () => {
		if (selectedServer) {
			setLoadingChannel(true);
			let channels = [];
			for await (let channel_id of selectedServer.channels) {
				let channel = await getChannelById(channel_id);
				channels.push(channel);
			}
			dispatch({ type: "ADD_CHANNEL", payload: channels });
			setLoadingChannel(false);
			setSelectedChannel(channels[0]);
		}

		return () => {
			dispatch({ type: "INITIAL_STATE" });
		};
	}, [selectedServer]);

	return (
		<ChannelContext.Provider
			value={{
				selectedChannel,
				channels,
				setSelectedChannel,
				loadingChannel,
				dispatch,
			}}
		>
			{children}
		</ChannelContext.Provider>
	);
}
