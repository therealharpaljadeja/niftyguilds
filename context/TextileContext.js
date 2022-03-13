import { Client, ThreadID, Where } from "@textile/hub";
import React, { useEffect, useState } from "react";
import { uuid } from "uuidv4";
export const TextileContext = React.createContext(null);

const keyInfo = {
	key: process.env.NEXT_PUBLIC_TEXTILE_KEY,
	secret: process.env.NEXT_PUBLIC_TEXTILE_SECRET,
};

const ThreadId = process.env.NEXT_PUBLIC_TEXTILE_THREAD_ID;

export function TextileContextProvider({ children }) {
	const [client, setClient] = useState(null);

	useEffect(() => {
		async function init() {
			const client = await Client.withKeyInfo(keyInfo);
			setClient(client);
		}

		init();
	}, []);

	async function getAllServers() {
		if (client) {
			return await client.find(
				ThreadID.fromString(ThreadId),
				"servers",
				{}
			);
		}
	}

	async function getServerById(server_id) {
		if (client) {
			let result = await client.findByID(
				ThreadID.fromString(ThreadId),
				"servers",
				server_id
			);
			return result;
		}
	}

	async function getChannelById(channel_id) {
		if (client) {
			let result = await client.findByID(
				ThreadID.fromString(ThreadId),
				"channels",
				channel_id
			);
			return result;
		}
	}

	async function createServer(nft) {
		if (client) {
			if (nft.contract_name && nft.contract_address && nft.logo_url) {
				let serverValues = {
					_id: uuid(),
					name: nft.contract_name,
					contract_address: nft.contract_address,
					channels: [],
					display_picture: nft.logo_url,
					chain_id: nft.chain_id.toString(),
				};

				let server = client.create(
					ThreadID.fromString(ThreadId),
					"servers",
					[serverValues]
				);
				return server;
			}
		}
	}

	async function createChannel(serverId, channelName) {
		if (client) {
			const server = await client.findByID(
				ThreadID.fromString(ThreadId),
				"servers",
				serverId
			);
			const channelValues = {
				_id: uuid(),
				name: channelName,
				server_id: server._id,
			};
			const channel = await client.create(
				ThreadID.fromString(ThreadId),
				"channels",
				[channelValues]
			);
			server.channels = [...server.channels, channel[0]];
			await client.save(ThreadID.fromString(ThreadId), "servers", [
				server,
			]);

			return channel;
		}
	}

	async function createMessage(channel_id, messageJson) {
		if (client) {
			const channel = await client.findByID(
				ThreadID.fromString(ThreadId),
				"channels",
				channel_id
			);
			const messageValues = {
				_id: uuid(),
				account_address: messageJson.account_address,
				message: messageJson.message,
				channel_id: channel._id,
			};

			const message = await client.create(
				ThreadID.fromString(ThreadId),
				"messages",
				[messageValues]
			);
			return message;
		}
	}

	async function subscribeToMessages(callback) {
		if (client) {
			let closer = client.listen(
				ThreadID.fromString(ThreadId),
				[{ collectionName: "messages" }, { actionTypes: ["CREATE"] }],
				callback
			);

			return closer;
		}
	}

	async function loadMessages(channel_id) {
		let query = new Where("channel_id").eq(channel_id);
		query.sort = { fieldPath: "_mod", desc: false };
		let messages = await client.find(
			ThreadID.fromString(ThreadId),
			"messages",
			query
		);
		return messages;
	}

	return (
		<TextileContext.Provider
			value={{
				getServerById,
				createServer,
				createChannel,
				createMessage,
				getAllServers,
				getChannelById,
				subscribeToMessages,
				loadMessages,
			}}
		>
			{children}
		</TextileContext.Provider>
	);
}
