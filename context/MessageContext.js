import React, { useState, useContext, useEffect, useReducer } from "react";
import { ChannelContext } from "./ChannelContext";
import { TextileContext } from "./TextileContext";

export const MessageContext = React.createContext(null);

const messageReducer = (state, action) => {
	switch (action.type) {
		case "ADD_MESSAGE":
			return [...state, ...action.payload];
		case "INITIAL_STATE":
		default:
			return [];
	}
};

export function MessageContextProvider({ children }) {
	const [currChannelMessages, dispatch] = useReducer(messageReducer, []);
	// const [, setCurrChannelMessages] = useState([]);
	const [loadingMessages, setLoadingMessages] = useState(true);
	const [unsubscribe, setUnsubscribe] = useState(null);
	const { selectedChannel } = useContext(ChannelContext);
	const { loadMessages, subscribeToMessages } = useContext(TextileContext);

	async function messagesCallback(reply, err) {
		if (reply) {
			if (reply.instance.channel_id == selectedChannel._id) {
				dispatch({ type: "ADD_MESSAGE", payload: [reply.instance] });
				// setCurrChannelMessages([
				// 	...currChannelMessages,
				// 	reply.instance,
				// ]);
			}
		} else {
			console.log(err);
		}
	}

	useEffect(() => {
		async function init() {
			setLoadingMessages(true);
			let messages = await loadMessages(selectedChannel._id);
			dispatch({ type: "ADD_MESSAGE", payload: messages });

			// setCurrChannelMessages(messages);
			let closer = await subscribeToMessages(messagesCallback);
			setLoadingMessages(false);
			setUnsubscribe(closer);
		}

		if (selectedChannel && currChannelMessages.length === 0) {
			init();
		}

		return () => {
			if (unsubscribe) {
				unsubscribe.close();
				dispatch({ type: "INITIAL_STATE" });
				console.log("message feed unmounted");
			}
		};
	}, [selectedChannel]);

	return (
		<MessageContext.Provider
			value={{
				currChannelMessages,
				loadingMessages,
			}}
		>
			{children}
		</MessageContext.Provider>
	);
}
