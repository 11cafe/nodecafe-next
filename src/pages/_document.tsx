import { ColorModeScript } from "@chakra-ui/react";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>{/* <link href="/dist/output.css" rel="stylesheet"/> */}</Head>
      <body>
        <ColorModeScript initialColorMode={"dark"} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
