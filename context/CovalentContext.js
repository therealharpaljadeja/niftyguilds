import axios from "axios";
import React, { useState } from "react";

export const CovalentContext = React.createContext(null);

let API_KEY = process.env.NEXT_PUBLIC_COVALENT_API_KEY;

export function CovalentContextProvider({ children }) {
	const [NFTsWithoutStats, setNFTsWithOutStats] = useState(undefined);
	const [NFTs, setNFTs] = useState(undefined);

	async function getNFTs(accountAddress, chain_ids) {
		let finalResult = [];
		for await (let id of chain_ids) {
			// make api call
			const response = await axios.get(
				`https://api.covalenthq.com/v1/${id}/address/${accountAddress}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key=${API_KEY}`
			);

			// filter response for nft data
			const nfts = response.data.data.items.filter((item) => {
				return item.type == "nft";
			});

			const nftsWithChainId = nfts.map((nft) => {
				return { ...nft, chain_id: id };
			});

			console.log(nftsWithChainId);

			finalResult = [...finalResult, ...nftsWithChainId];
		}

		setNFTs(finalResult);
	}

	//

	return (
		<CovalentContext.Provider value={{ getNFTs, NFTs, NFTsWithoutStats }}>
			{children}
		</CovalentContext.Provider>
	);
}
