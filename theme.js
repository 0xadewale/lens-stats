import { extendTheme } from '@chakra-ui/react'

const config = {
  initialColorMode: 'Light',
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({ config })

export default theme
