import {
	VStack,
	Avatar,
	SkeletonCircle,
	AvatarBadge,
	Image,
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { CovalentContext } from "../context/CovalentContext";
import { ServerContext } from "../context/ServerContext";
import { TextileContext } from "../context/TextileContext";

function ServerList() {
	const {
		Servers: servers,
		selectedServer,
		setSelectedServer,
		setServers,
	} = useContext(ServerContext);
	const { getServerById, createServer, createChannel, getAllServers } =
		useContext(TextileContext);
	const { NFTs } = useContext(CovalentContext);
	useEffect(async () => {
		if (NFTs !== undefined) {
			let servers = [];
			let serversInDB = await getAllServers();
			console.log(serversInDB);
			for await (let nft of NFTs) {
				// check if server for nft is created.
				let result = serversInDB.filter(
					(server) => server.contract_address == nft.contract_address
				);
				if (result.length > 0) {
					servers.push(result[0]);
				} else {
					// if no then create one and add this user to the server.
					let server = await createServer(nft);
					if (server !== undefined) {
						server = await getServerById(server[0]);
						console.log(server);
						let channel = await createChannel(
							server._id,
							"general"
						);
						server = await getServerById(server._id);
						console.log(channel);
						servers.push(server);
					}
				}
			}
			setServers(servers);
			setSelectedServer(servers[0]);
		}
		return () => setNFTs(undefined);
	}, [NFTs]);

	function chainBadge(chain_id) {
		switch (chain_id) {
			case "1":
				return "https://www.covalenthq.com/static/images/icons/display-icons/ethereum-eth-logo.png?v3";
			case "137":
				return "https://www.covalenthq.com/static/images/icons/display-icons/polygon-matic-logo.png?v3";
			case "43114":
				return "https://www.covalenthq.com/static/images/icons/display-icons/avalanche-avax-logo.png?v3";
			case "56":
				return "https://www.covalenthq.com/static/images/icons/display-icons/binance-coin-bnb-logo.png?v3";
			case "250":
				return "https://www.covalenthq.com/static/images/icons/display-icons/fantom-ftm-logo.png?v3";
			default:
				return "";
		}
	}

	return (
		<VStack
			width="70px"
			borderRight="1px solid var(--chakra-colors-brand-100)"
			height="100vh"
			px={2}
			py={2}
			bg="var(--chakra-colors-brand-200)"
		>
			{servers !== undefined ? (
				Object.entries(servers).length !== 0 ? (
					Object.entries(servers).map(([key, server]) => {
						return (
							<Avatar
								size="md"
								src=""
								borderRadius={
									selectedServer === server ? "15px" : "full"
								}
								key={server._id}
								name={server.name}
								onClick={() => setSelectedServer(server)}
							>
								<AvatarBadge border="none" boxSize="1em">
									<Image
										w={4}
										src={chainBadge(server.chain_id)}
									/>
								</AvatarBadge>
							</Avatar>
						);
					})
				) : (
					<SkeletonCircle size="48px" />
				)
			) : null}
		</VStack>
	);
}

export default ServerList;
