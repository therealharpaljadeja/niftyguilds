import { useContext, memo } from "react";
import { HStack, Tag, Avatar } from "@chakra-ui/react";
import { Web3Context } from "../context/Web3Context";
import ConnectWallet from "./ConnectWallet";

const AccountSection = memo(() => {
	const { account, connect, walletConnecting } = useContext(Web3Context);
	console.log("account section");
	if (account) {
		return (
			<HStack>
				<Avatar size="sm" name={account} />
				<Tag
					bg="var(--chakra-colors-brand-300)"
					color="white"
					height="100%"
				>
					{`${account.substr(0, 7)}...${account.substr(-7, 7)}`}
				</Tag>
			</HStack>
		);
	} else
		return <ConnectWallet onClick={connect} isLoading={walletConnecting} />;
});

export default AccountSection;
