import { useState, useContext, useEffect, useCallback } from "react";
import {
	VStack,
	HStack,
	Heading,
	Button,
	Skeleton,
	Input,
	Icon,
	Text,
	Avatar,
	Tag,
	IconButton,
} from "@chakra-ui/react";
import { FiSend, FiHash } from "react-icons/fi";
import MessageFeed from "./MessageFeed";
import { ChannelContext } from "../context/ChannelContext";
import { TextileContext } from "../context/TextileContext";
import { Web3Context } from "../context/Web3Context";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
	MessageContext,
	MessageContextProvider,
} from "../context/MessageContext";

function Channel() {
	const [currMessage, setCurrMessage] = useState("");
	const { selectedChannel } = useContext(ChannelContext);
	const { createMessage } = useContext(TextileContext);
	const { account } = useContext(Web3Context);

	async function sendMessage() {
		let messageJson = {
			account_address: account,
			message: currMessage,
		};
		let message = await createMessage(selectedChannel._id, messageJson);
		setCurrMessage("");
	}

	return (
		<VStack
			height="100vh"
			width="100%"
			spacing={0}
			borderRight="1px solid var(--chakra-colors-brand-200)"
		>
			<VStack
				height="55px"
				borderBottom="1px solid var(--chakra-colors-brand-200)"
				width="100%"
				alignItems="flex-start"
				px={5}
				py={2}
				justifyContent="center"
				bg="var(--chakra-colors-brand-100)"
			>
				<HStack width="100%" padding={2} spacing={1}>
					{selectedChannel !== null ? (
						<>
							<Icon as={FiHash} />
							<Text>{selectedChannel.name}</Text>
						</>
					) : (
						<Skeleton>Channel loading</Skeleton>
					)}
				</HStack>
			</VStack>
			{selectedChannel ? (
				<MessageContextProvider key={selectedChannel._id}>
					<MessageFeed
						id={selectedChannel._id}
						selectedChannel={selectedChannel}
						key={selectedChannel._id}
					/>
				</MessageContextProvider>
			) : (
				<VStack
					width="100%"
					justifyContent="center"
					flexGrow={1}
					overflowY="scroll"
					bg="var(--chakra-colors-brand-100)"
				>
					<Heading>NiftyGuilds</Heading>
					<Text>Chat rooms for NFT holders.</Text>
				</VStack>
			)}
			<HStack
				padding={2}
				height="55px"
				width="100%"
				borderTop="1px solid var(--chakra-colors-brand-200)"
				bg="var(--chakra-colors-brand-100)"
			>
				<Input
					disabled={selectedChannel === null}
					value={currMessage}
					borderColor="var(--chakra-colors-brand-300)"
					onChange={({ target }) => setCurrMessage(target.value)}
				/>
				<Button
					bg="var(--chakra-colors-brand-300)"
					disabled={selectedChannel === null}
					onClick={sendMessage}
					_hover={{
						bg: "var(--chakra-colors-brand-300)",
					}}
					aria-label="Send Message"
					leftIcon={<FiSend />}
				>
					Send
				</Button>
			</HStack>
		</VStack>
	);
}

export default Channel;
