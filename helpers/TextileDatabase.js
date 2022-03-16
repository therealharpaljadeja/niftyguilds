const { Client, ThreadID } = require("@textile/hub");
const { uuid } = require("uuidv4");

const KeyInfo = {
	key: "b64vxo5bm6trv3kawn2ulcbfhp4",
	secret: "b64vxo5bm6trv3kawn2ulcbfhp4",
};

const ServerSchema = {
	title: "Servers",
	type: "object",
	required: ["contract_address", "_id"],
	properties: {
		_id: {
			type: "string",
		},
		name: {
			type: "string",
		},
		contract_address: {
			type: "string",
		},
		channels: {
			type: "array",
			items: {
				type: "string",
			},
		},
		display_picture: {
			type: "string",
		},
		chain_id: {
			type: "string",
		},
	},
};

const ChannelSchema = {
	title: "Channels",
	type: "object",
	required: ["server_id"],
	properties: {
		_id: {
			type: "string",
		},
		name: {
			type: "string",
		},
		server_id: {
			type: "string",
		},
	},
};

const MessageSchema = {
	title: "Messages",
	type: "object",
	required: ["account_address", "channel_id", "message"],
	properties: {
		_id: {
			type: "string",
		},
		account_address: {
			type: "string",
		},
		message: {
			type: "string",
		},
		channel_id: {
			type: "string",
		},
	},
};

const ThreadId = "bafk365omjl7v5fk4etp7tyvs4e4eup6filfxl7nxlqwpoclupb7c3ei";

async function deleteDatabase(client) {
	let result = await client.find(
		ThreadID.fromString(ThreadId),
		"messages",
		{}
	);
	// if (result.length < 1) return;

	let ids = await result.map((instance) => instance._id);
	await client.delete(ThreadID.fromString(ThreadId), "messages", ids);

	await client.deleteCollection(ThreadID.fromString(ThreadId), "messages");

	result = await client.find(ThreadID.fromString(ThreadId), "channels", {});

	// if (result.length < 1) return;

	ids = await result.map((instance) => instance._id);
	await client.delete(ThreadID.fromString(ThreadId), "channels", ids);

	await client.deleteCollection(ThreadID.fromString(ThreadId), "channels");

	result = await client.find(ThreadID.fromString(ThreadId), "servers", {});

	// if (result.length < 1) return;

	ids = await result.map((instance) => instance._id);
	await client.delete(ThreadID.fromString(ThreadId), "servers", ids);

	await client.deleteCollection(ThreadID.fromString(ThreadId), "servers");

	console.log("deleted");
}

async function createDatabase(client) {
	await client.newCollection(ThreadID.fromString(ThreadId), {
		name: "servers",
		schema: ServerSchema,
	});
	await client.newCollection(ThreadID.fromString(ThreadId), {
		name: "channels",
		schema: ChannelSchema,
	});
	await client.newCollection(ThreadID.fromString(ThreadId), {
		name: "messages",
		schema: MessageSchema,
	});
}

async function createMessage(client, channel_id, messageJson) {
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

(async () => {
	const client = await Client.withKeyInfo(KeyInfo);

	// console.log(await client.listCollections(ThreadID.fromString(ThreadId)));
	// console.log(
	// 	await client.find(ThreadID.fromString(ThreadId), "channels", {})
	// );
	// await deleteDatabase(client);

	// await createDatabase(client);
	// console.log(await client.listCollections(ThreadID.fromString(ThreadId)));
	await createMessage(client, "72276fe9-f783-4b01-8e13-8de3e96991d0", {
		account_address: "0x8u29da719c70925920a61d5a4f9fd738fe3n75hq",
		message: `Just realize that I have a bunch of zorbs, all with kind of single-ish color. I don't understand myself any more 😆`,
	});
})();
