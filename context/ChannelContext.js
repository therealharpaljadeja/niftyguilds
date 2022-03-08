import React, { useEffect, useState, useContext } from "react";
import { ServerContext } from "./ServerContext";
import { TextileContext } from "./TextileContext";

export const ChannelContext = React.createContext(null);

export function ChannelContextProvider({ children }) {
	const { selectedServer } = useContext(ServerContext);
	const { getChannelById } = useContext(TextileContext);
	const [channels, setChannels] = useState([]);
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
			setChannels(channels);
			setLoadingChannel(false);
			setSelectedChannel(channels[0]);
		}
	}, [selectedServer]);
	return (
		<ChannelContext.Provider
			value={{
				selectedChannel,
				channels,
				setSelectedChannel,
				loadingChannel,
			}}
		>
			{children}
		</ChannelContext.Provider>
	);
}
