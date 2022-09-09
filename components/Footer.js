import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import {
    Center, Stack, Text
} from '@chakra-ui/react'
import {
  Flex,
  Box,
} from '@chakra-ui/react'

export function Footer() {

  return (
      <footer>
        <Box
            w='full'
            h='10rem'
            bg='gray.200'
            py={6}
            _dark={{ bg: 'gray.900'}}
            position='absolute'
            bottom="0"
        >
          <Center h='full' flexDirection='column'>
              <Flex>
                  <Stack direction='row'>
                      <Box>Made with ☕ by</Box>
                      <Text color='purple.600' _hover={{ color: 'teal.600'}}>
                          <a
                              href="https://lenster.xyz/u/adewale.lens"
                              target="_blank"
                              rel="noreferrer"
                          >@adewale</a>
                      </Text>
                  </Stack>
              </Flex>
              <div className="py-4">
                  <div className="flex gap-6">
                      <a href="https://twitter.com/crypto_adewale" aria-label="Twitter link" target="_blank" rel="noreferrer">
                          <Text fontSize='xl'  color='twitter.500' w={7}>
                              <FontAwesomeIcon icon={faTwitter} />
                          </Text>
                      </a>
                      <a href="https://github.com/0xadewale" aria-label="Github link"  target="_blank" rel="noreferrer">
                          <Text fontSize='xl'  color='gray.700' w={7} _dark={{ color: 'gray.200' }}>
                              <FontAwesomeIcon icon={faGithub} />
                          </Text>
                      </a>
                  </div>
              </div>
          </Center>
        </Box>
      </footer>
  )
}
