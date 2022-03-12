import {
	VStack,
	HStack,
	Heading,
	Avatar,
	Tag,
	Text,
	SkeletonCircle,
	Skeleton,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { ChannelContext } from "../context/ChannelContext";
import { MessageContext } from "../context/MessageContext";
import { ServerContext } from "../context/ServerContext";
import svgAvatarGenerator from "../helpers/svgAvatarGenerator";

function MessageFeed({ id, selectedChannel }) {
	const { selectedServer } = useContext(ServerContext);
	const { currChannelMessages, loadingMessages } = useContext(MessageContext);
	const { loadingChannel } = useContext(ChannelContext);
	// const { loadMessages, subscribeToMessages } = useContext(TextileContext);
	// const [unsubscribe, setUnsubscribe] = useState(null);

	// useEffect(async () => {
	// 	setLoadingMessages(true);
	// 	console.log(currChannelMessages);
	// 	let messages = await loadMessages(selectedChannel._id);
	// 	dispatch({ type: "ADD_MESSAGE", payload: messages });
	// 	let closer = await subscribeToMessages(messagesCallback);
	// 	console.log(closer);
	// 	setLoadingMessages(false);
	// 	// setUnsubscribe(closer.close);
	// }, [selectedChannel, id]);

	// useEffect(() => {
	// 	return () => {
	// 		console.log("unmounting message feed");
	// 		if (unsubscribe) {
	// 			unsubscribe();
	// 		}
	// 		dispatch({ type: "INITIAL_STATE" });
	// 		console.log(currChannelMessages);
	// 		console.log("id changed");
	// 	};
	// }, []);

	return (
		<div
			style={{
				width: "100%",
				paddingTop: "20px",
				background: "var(--chakra-colors-brand-100)",
				justifyContent: "flex-end",
				display: "flex",
				flexGrow: "1",
				flexDirection: "column",
				textAlign: "center",
				overflow: "hidden",
			}}
		>
			<ul height="100%" style={{ overflowY: "auto" }}>
				{selectedServer !== null ? (
					<Heading mb={5}>
						Welcome to {`#${selectedChannel.name}`}!
					</Heading>
				) : null}
				{!loadingMessages & !loadingChannel ? (
					currChannelMessages.length > 0 ? (
						currChannelMessages.map((message) => {
							return (
								<HStack
									justifyContent="flex-start"
									alignItems="flex-start"
									width="100%"
									px={5}
									py={4}
									as="li"
									key={message._id}
									_hover={{
										background:
											"var(--chakra-colors-brand-400)",
									}}
								>
									<Avatar
										name={message.account_address}
										src={svgAvatarGenerator(
											message.account_address,
											{ dataUri: true }
										)}
										size="md"
									/>
									<VStack spacing={0} alignItems="flex-start">
										<Tag
											bg="var(--chakra-colors-brand-300)"
											color="white"
										>
											{`${message.account_address.substr(
												0,
												7
											)}...${message.account_address.substr(
												-7,
												7
											)}`}
										</Tag>
										<Text>{message.message}</Text>
									</VStack>
								</HStack>
							);
						})
					) : null
				) : (
					<>
						<HStack
							justifyContent="flex-start"
							width="100%"
							px={5}
							py={4}
							alignItems="flex-start"
							_hover={{
								background: "var(--chakra-colors-brand-400)",
							}}
						>
							<SkeletonCircle size="10" />
							<VStack spacing={2} alignItems="flex-start">
								<Skeleton>...loading username</Skeleton>
								<Skeleton>...loading message</Skeleton>
							</VStack>
						</HStack>

						<HStack
							justifyContent="flex-start"
							width="100%"
							px={5}
							py={4}
							alignItems="flex-start"
							_hover={{
								background: "var(--chakra-colors-brand-400)",
							}}
						>
							<SkeletonCircle size="10" />
							<VStack spacing={2} alignItems="flex-start">
								<Skeleton>...loading username</Skeleton>
								<Skeleton>...loading message</Skeleton>
							</VStack>
						</HStack>

						<HStack
							justifyContent="flex-start"
							width="100%"
							px={5}
							py={4}
							alignItems="flex-start"
							_hover={{
								background: "var(--chakra-colors-brand-400)",
							}}
						>
							<SkeletonCircle size="10" />
							<VStack spacing={2} alignItems="flex-start">
								<Skeleton>...loading username</Skeleton>
								<Skeleton>...loading message</Skeleton>
							</VStack>
						</HStack>
					</>
				)}
			</ul>
		</div>
	);
}

export default MessageFeed;
