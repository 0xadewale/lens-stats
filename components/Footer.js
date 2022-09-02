import { useRouter } from 'next/router'
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
  const router = useRouter()

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
                      <Text color='purple.300' _hover={{ color: 'purple.500'}}>
                          <a
                              href="https://lenster.xyz/u/adewale.lens"
                              target="_blank"
                              rel="noreferrer"
                          >@adewale</a>
                      </Text>
                  </Stack>
              </Flex>
              <Flex py={4}>
                  <Stack direction='row' spacing={6}>
                      <a href="https://twitter.com/crypto_adewale" target="_blank" rel="noreferrer">
                          <Text fontSize='xl'  color='twitter.400'>
                              <FontAwesomeIcon icon={faTwitter} />
                          </Text>
                      </a>
                      <a href="https://github.com/0xadewale" target="_blank" rel="noreferrer">
                          <Text fontSize='xl'>
                              <FontAwesomeIcon icon={faGithub} />
                          </Text>
                      </a>
                  </Stack>
              </Flex>
          </Center>
        </Box>
      </footer>
  )
}
