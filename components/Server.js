import {
	VStack,
	HStack,
	Text,
	Icon,
	Skeleton,
	Heading,
	Button,
	Input,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { FiHash } from "react-icons/fi";
import { ChannelContext } from "../context/ChannelContext";
import { ServerContext } from "../context/ServerContext";
import { TextileContext } from "../context/TextileContext";

function Server() {
	const { selectedServer } = useContext(ServerContext);
	const { selectedChannel, channels, setSelectedChannel } =
		useContext(ChannelContext);
	const { createChannel } = useContext(TextileContext);
	const [newChannelName, setNewChannelName] = useState("");

	function handleChange({ target }) {
		setNewChannelName(target.value);
	}
	return (
		<>
			<VStack
				height="55px"
				width="100%"
				borderBottom="1px solid var(--chakra-colors-brand-100)"
				alignItems="flex-start"
				padding={2}
				id="title"
				justifyContent="center"
				bg="var(--chakra-colors-brand-200)"
			>
				{selectedServer !== null ? (
					<Text>{selectedServer.name}</Text>
				) : (
					<Skeleton>Servers title loading</Skeleton>
				)}
			</VStack>

			<VStack
				flexGrow={1}
				width="100%"
				px={5}
				py={2}
				id="stats"
				alignItems="flex-start"
				bg="var(--chakra-colors-brand-200)"
			>
				{selectedServer ? (
					<Heading size="sm">Stats</Heading>
				) : (
					<Skeleton>Stats Loading...</Skeleton>
				)}
				{/* {serverMembers !== null ? (
					<HStack
						width="100%"
						padding={2}
						borderRadius={5}
						spacing={1}
						color="var(--chakra-colors-brand-500)"
						_hover={{
							cursor: "pointer",
							background: "var(--chakra-colors-brand-400)",
						}}
					>
						<Text>Server Members: </Text>
						<Text>{serverMembers}</Text>
					</HStack>
				) : (
					<Skeleton>Server Members Loading...</Skeleton>
				)} */}
				{selectedServer ? (
					<Heading size="sm">Channels</Heading>
				) : (
					<Skeleton>Channels Loading...</Skeleton>
				)}
				{channels.length > 0 ? (
					channels.map((channel) => {
						return (
							<HStack
								width="100%"
								padding={2}
								borderRadius={5}
								spacing={1}
								key={channel._id}
								color={
									selectedChannel === channel
										? "white"
										: "var(--chakra-colors-brand-500)"
								}
								onClick={() => setSelectedChannel(channel)}
								_hover={{
									cursor: "pointer",
									background:
										"var(--chakra-colors-brand-400)",
								}}
							>
								<Icon as={FiHash} />
								<Text>{channel.name}</Text>
							</HStack>
						);
					})
				) : (
					<VStack>
						<Skeleton>Channel loading soon</Skeleton>
						<Skeleton>Channel loading soon</Skeleton>
						<Skeleton>Channel loading soon</Skeleton>
					</VStack>
				)}
				{channels.length > 0 ? (
					<VStack>
						<Input onChange={handleChange} value={newChannelName} />
						<Button
							_hover={{
								bg: "var(--chakra-colors-brand-300)",
							}}
							bg="var(--chakra-colors-brand-300)"
							width="100%"
							onClick={() =>
								createChannel(
									selectedServer._id,
									newChannelName
								)
							}
							disabled={!(newChannelName.length > 0)}
						>
							Add Channel
						</Button>
					</VStack>
				) : null}
			</VStack>
		</>
	);
}

export default Server;