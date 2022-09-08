import { ColorModeScript } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import theme from '../theme'

export default class _document extends NextDocument {
  render() {
    return (
        <Html lang='en'>
          <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
          </Head>
          <body>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <Main />
            <NextScript />
          </body>
        </Html>
    )
  }
}
