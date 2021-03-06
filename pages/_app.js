import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/provider";
import { Web3ContextProvider } from "../context/Web3Context";
import theme from "../theme";
import "@fontsource/inter";
import { CovalentContextProvider } from "../context/CovalentContext";
import { TextileContextProvider } from "../context/TextileContext";
import { ServerContextProvider } from "../context/ServerContext";
import { ChannelContextProvider } from "../context/ChannelContext";

function MyApp({ Component, pageProps }) {
	return (
		<Web3ContextProvider>
			<CovalentContextProvider>
				<TextileContextProvider>
					<ServerContextProvider>
						<ChannelContextProvider>
							<ChakraProvider theme={theme}>
								<Component {...pageProps} />
							</ChakraProvider>
						</ChannelContextProvider>
					</ServerContextProvider>
				</TextileContextProvider>
			</CovalentContextProvider>
		</Web3ContextProvider>
	);
}

export default MyApp;
