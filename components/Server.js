import {
	VStack,
	HStack,
	Text,
	Icon,
	Skeleton,
	Heading,
	Button,
	Input,
	ModalCloseButton,
	Modal,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalBody,
	useDisclosure,
	ModalOverlay,
	InputLeftElement,
	InputGroup,
	toast,
	useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { FiHash } from "react-icons/fi";
import { BiStats } from "react-icons/bi";
import { ChannelContext } from "../context/ChannelContext";
import { ServerContext } from "../context/ServerContext";
import { TextileContext } from "../context/TextileContext";
import axios from "axios";

let API_KEY = process.env.NEXT_PUBLIC_COVALENT_API_KEY;

function Server() {
	const toast = useToast();
	const { selectedServer } = useContext(ServerContext);
	const { selectedChannel, channels, setSelectedChannel, dispatch } =
		useContext(ChannelContext);
	const { createChannel, getChannelById } = useContext(TextileContext);
	const [newChannelName, setNewChannelName] = useState("");
	const [serverStats, setServerStats] = useState(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [channelCreating, setChannelCreating] = useState(false);

	useEffect(() => {
		async function getNFTStats() {
			try {
				let response = await axios.get(
					`https://api.covalenthq.com/v1/${selectedServer.chain_id}/nft_market/collection/${selectedServer.contract_address}/?key=${API_KEY}`
				);
				setServerStats({ stats: response.data.data.items[0] });
			} catch (err) {
				setServerStats(undefined);
			}
		}
		if (selectedServer) {
			getNFTStats();
		}
	}, [selectedServer]);

	function handleChange({ target }) {
		setNewChannelName(target.value);
	}

	async function createChannelFromModal(server_id, channel_name) {
		setChannelCreating(true);
		let channel_id = await createChannel(server_id, channel_name);
		toast({
			title: "Channel created",
			description: "Channel Successfully created! Refresh",
			status: "success",
			isClosable: true,
		});
		let channel = await getChannelById(channel_id[0]);
		dispatch({ type: "ADD_CHANNEL", payload: [channel] });
		setNewChannelName("");
		onClose();
		setChannelCreating(false);
	}
	return (
		<>
			<Modal
				closeOnOverlayClick={true}
				bg="var(--chakra-colors-brand-200)"
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent bg="var(--chakra-colors-brand-200)">
					<ModalCloseButton />
					<ModalHeader textAlign="center">Add Channel</ModalHeader>
					<ModalBody>
						<InputGroup>
							<InputLeftElement>
								<FiHash />
							</InputLeftElement>
							<Input
								onChange={handleChange}
								value={newChannelName}
								placeholder="Channel Name"
							/>
						</InputGroup>
					</ModalBody>
					<ModalFooter justifyContent="center">
						<Button
							bg="var(--chakra-colors-brand-300)"
							variant="ghost"
							isLoading={channelCreating}
							onClick={() =>
								createChannelFromModal(
									selectedServer._id,
									newChannelName
								)
							}
							disabled={!(newChannelName.length > 0)}
						>
							Add Channel
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
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
				{selectedServer !== null && selectedServer !== undefined ? (
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
				overflowY="scroll"
			>
				{serverStats != null && serverStats != undefined ? (
					<VStack alignItems="flex-start">
						<Heading size="sm">Stats</Heading>
						<HStack
							justifyContent="flex-start"
							width="100%"
							padding={2}
							borderRadius={5}
							spacing={1}
							color={"var(--chakra-colors-brand-500)"}
							_hover={{
								cursor: "pointer",
								background: "var(--chakra-colors-brand-400)",
							}}
						>
							<Icon as={BiStats} />
							<Text>Collection Ticker: </Text>
							<Text>
								{serverStats.stats.collection_ticker_symbol}
							</Text>
						</HStack>

						<HStack
							justifyContent="flex-start"
							width="100%"
							padding={2}
							borderRadius={5}
							spacing={1}
							color={"var(--chakra-colors-brand-500)"}
							_hover={{
								cursor: "pointer",
								background: "var(--chakra-colors-brand-400)",
							}}
						>
							<Icon as={BiStats} />
							<Text>Floor price 7d: </Text>
							<Text>
								{serverStats.stats.floor_price_quote_7d}
							</Text>
						</HStack>

						<HStack
							justifyContent="flex-start"
							width="100%"
							padding={2}
							borderRadius={5}
							spacing={1}
							color={"var(--chakra-colors-brand-500)"}
							_hover={{
								cursor: "pointer",
								background: "var(--chakra-colors-brand-400)",
							}}
						>
							<Icon as={BiStats} />
							<Text>Vol 1d: </Text>
							<Text>{serverStats.stats.volume_quote_day}</Text>
						</HStack>

						<HStack
							justifyContent="flex-start"
							width="100%"
							padding={2}
							borderRadius={5}
							spacing={1}
							color={"var(--chakra-colors-brand-500)"}
							_hover={{
								cursor: "pointer",
								background: "var(--chakra-colors-brand-400)",
							}}
						>
							<Icon as={BiStats} />
							<Text>Avg Vol 1d: </Text>
							<Text>
								{serverStats.stats.average_volume_quote_day}
							</Text>
						</HStack>
					</VStack>
				) : null}
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
								bg={
									selectedChannel === channel
										? "var(--chakra-colors-brand-400)"
										: null
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
					<VStack width="100%">
						<Button
							_hover={{
								bg: "var(--chakra-colors-brand-300)",
							}}
							bg="var(--chakra-colors-brand-300)"
							width="100%"
							onClick={onOpen}
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
