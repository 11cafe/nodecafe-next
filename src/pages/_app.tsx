import type { AppProps } from "next/app";
import Layout from "../components/layout";
import Head from "next/head";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const theme = extendTheme({
    components: {
      Menu: {
        baseStyle: (props: StyleFunctionProps) => ({
          list: {
            // bg: props.colorMode === "dark" ? "#2D3748" : "#F6F8FA",
          },
        }),
      },
      Card: {
        baseStyle: (props: StyleFunctionProps) => ({
          container: {
            // backgroundColor: props.colorMode === "dark" ? "#171B21" : "#F6F8FA",
          },
        }),
      },
    },
    styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          bg: props.colorMode === "dark" ? "#0E1116" : "white",
          color: props.colorMode === "dark" ? "white" : "gray.800",
        },
        ".mdx-editor": {
          h1: {
            fontSize: "2xl",
            mb: "4",
          },
          h2: {
            fontSize: "xl",
            mb: "4",
          },
          h3: {
            fontSize: "lg",
            mb: "4",
          },
          h4: {
            fontSize: "md",
            mb: "4",
          },
          h5: {
            fontSize: "sm",
            mb: "4",
          },
          h6: {
            fontSize: "sm",
          },
          p: {
            fontSize: "sm",
            lineHeight: "1.4",
          },
          blockquote: {
            bg: props.colorMode === "dark" ? "#2D3748" : "#F6F8FA",
            borderLeft: "5px solid",
            borderColor: props.colorMode === "dark" ? "gray.300" : "gray.500",
            px: "4",
            py: "2",
            my: "4",
          },
        },
      }),
    },
  });
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={session}>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
          />
          <link rel="shortcut icon" href="../../favicon.ico" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </ChakraProvider>
  );
}
