import Link from 'next/link'
import { useRouter } from 'next/router'
import {Image, useColorMode} from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import {
  Flex,
  Box,
  Spacer,
  Input,
  Button,
  Progress
} from '@chakra-ui/react'

export function Navbar({
    connected,
    profile,
    metamask,
    signIn
}) {
  const { colorMode, toggleColorMode } = useColorMode()
  const router = useRouter()
  const [searchText, setSearchText] = useState("")

  let inputHandler = (e) => {
    setSearchText(e.target.value)
  }

  let search = async (e) => {
    if (e.key === 'Enter') {
      await router.push('/profiles?search=' + searchText)
    }
  }

  return (
      <Box mb={2}>
        <nav className="navbar">
          <Flex align='center'>
            <Box p='4'>
              <Flex align="center">
                <Box>
                  <Link href="/">
                    <a>Lens Stats</a>
                  </Link>
                </Box>
                <Box mx={2}>
                  <Input
                      placeholder='Search'
                      onKeyDown={search}
                      onChange={inputHandler}
                  />
                </Box>
              </Flex>
            </Box>
            <Spacer />
            <Box p={4}>
              <Button variant='ghost' onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon /> }
              </Button>
            </Box>
            {
                profile && (
                    <Box p='4'>
                      <Image
                          src={profile.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                          alt="user profile picture"
                          objectFit="cover"
                          boxSize="2.5rem"
                          borderRadius='full'
                      />
                    </Box>
                )
            }
            {
                metamask && connected && !profile && (
                    <Box p='4'>
                      <Progress size='xs' isIndeterminate />
                    </Box>
                )
            }
            {
                !connected && (
                    <Box py='4' pr={4}>
                      <Button colorScheme="teal" onClick={signIn}>Login</Button>
                    </Box>
                )
            }
          </Flex>
        </nav>
      </Box>
  )
}
