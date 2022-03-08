import React, { useEffect, useState } from "react";
import { createStandaloneToast } from "@chakra-ui/react";

export const Web3Context = React.createContext(null);

export function Web3ContextProvider({ children }) {
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);
	const [account, setAccount] = useState(null);
	const [walletConnecting, setWalletConnecting] = useState(false);
	const toast = createStandaloneToast();

	useEffect(() => {
		if (window.ethereum) {
			setIsWalletInstalled(true);
		}
	}, []);

	async function connect() {
		if (isWalletInstalled) {
			setWalletConnecting(true);
			window.ethereum
				.request({
					method: "eth_requestAccounts",
				})
				.then((accounts) => {
					setAccount(accounts[0]);
				})
				.catch((err) => {
					toast({
						title: "User rejected",
						description: "User rejected connection",
						status: "error",
						position: "bottom-right",
						variant: "left-accent",
						isClosable: true,
					});
					console.log(err);
				})
				.finally(() => {
					setWalletConnecting(false);
				});
		} else {
			toast({
				title: "Wallet Not Installed",
				description: "Install Wallet",
				status: "error",
				position: "bottom-right",
				variant: "left-accent",
				isClosable: true,
			});
		}
	}

	return (
		<Web3Context.Provider
			value={{ isWalletInstalled, walletConnecting, account, connect }}
		>
			{children}
		</Web3Context.Provider>
	);
}
