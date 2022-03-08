import { HStack, VStack } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useContext } from "react";
import Channel from "../components/Channel";
import Server from "../components/Server";
import ServerList from "../components/ServerList";
import { Web3Context } from "../context/Web3Context";
import { CovalentContext } from "../context/CovalentContext";
import IsWalletInstalledModal from "../components/IsWalletInstalledModal";
import AccountSection from "../components/AccountSection";
import { ServerContext } from "../context/ServerContext";

export default function Home() {
	const { account } = useContext(Web3Context);
	const { getNFTs } = useContext(CovalentContext);
	const { selectedServer } = useContext(ServerContext);
	useEffect(() => {
		if (account) {
			getNFTs(account, ["1", "137", "43114", "56", "250"]);
		}
	}, [account]);

	return (
		<div>
			<Head>
				<title>NiftyGuilds</title>
			</Head>
			<IsWalletInstalledModal />
			<HStack spacing={0}>
				<ServerList />
				<VStack width="300px" height="100vh" spacing={0}>
					<Server />
					<VStack
						height="55px"
						width="100%"
						borderTop="1px solid var(--chakra-colors-brand-100)"
						alignItems="flex-start"
						padding={2}
						justifyContent="center"
						bg="var(--chakra-colors-brand-200)"
					>
						<AccountSection />
					</VStack>
				</VStack>
				<Channel />
			</HStack>
		</div>
	);
}
