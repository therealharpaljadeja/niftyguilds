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
	const { selectedChannel } = useContext(ChannelContext);
	const { loadMessages, subscribeToMessages } = useContext(TextileContext);

	async function messagesCallback(reply, err) {
		if (reply) {
			if (reply.instance.channel_id == selectedChannel._id) {
				dispatch({ type: "ADD_MESSAGE", payload: [reply.instance] });
			}
		} else {
			console.log(err);
		}
	}

	useEffect(() => {
		async function init() {
			let closer = await subscribeToMessages(messagesCallback);
			return () => {
				closer.close();
			};
		}
		init();
	}, []);

	useEffect(() => {
		async function init() {
			setLoadingMessages(true);
			let messages = await loadMessages(selectedChannel._id);
			dispatch({ type: "ADD_MESSAGE", payload: messages });

			// setCurrChannelMessages(messages);
			setLoadingMessages(false);
		}

		if (selectedChannel && currChannelMessages.length === 0) {
			init();
		}

		return () => {
			dispatch({ type: "INITIAL_STATE" });
			console.log("message feed unmounted");
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
