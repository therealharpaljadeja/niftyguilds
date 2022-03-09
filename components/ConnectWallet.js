import { Button } from "@chakra-ui/react";

function ConnectWallet({ onClick, isLoading }) {
	return (
		<Button
			isLoading={isLoading}
			onClick={onClick}
			_hover={{
				bg: "var(--chakra-colors-brand-300)",
			}}
			bg="var(--chakra-colors-brand-300)"
			width="100%"
		>
			Connect Wallet
		</Button>
	);
}

export default ConnectWallet;
