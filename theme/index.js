import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
	styles: {
		global: {
			body: {
				color: "white !important",
				fontFamily: "Inter !important",
			},
		},
	},
	fonts: {
		heading: "Inter !important",
	},
	colors: {
		brand: {
			100: "#36393e",
			200: "#23272A",
			300: "#7289da",
			400: "#424549",
			500: "#99aab5",
		},
	},
});

export default theme;
