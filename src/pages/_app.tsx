import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { fonts } from "@/lib/fonts";
import theme from "@/lib/theme";

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<>
			<style
				jsx
				global
			>
				{`
					:root {
						--font-rubik: ${fonts.rubik.style.fontFamily};
					}
				`}
			</style>
			<ChakraProvider theme={theme}>
				<Component {...pageProps} />
			</ChakraProvider>
		</>
	);
};

export default App;
