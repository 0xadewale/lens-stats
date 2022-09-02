import Link from 'next/link'
import { useRouter } from 'next/router'
import {Badge, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Show, useColorMode} from '@chakra-ui/react'
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
                <Show above='md'>
                  <Link href='/'>
                    <Button
                        mx={2}
                        size='sm'
                        variant={router.pathname === '/' ? 'solid' : 'ghost'}
                    >
                      Home
                    </Button>
                  </Link>
                  <Link href='/giveaway'>
                    <Button
                        mx={2}
                        size='sm'
                        variant={router.pathname === '/giveaway' ? 'solid' : 'ghost'}
                    >
                      Giveaway
                    </Button>
                  </Link>
                  <Link href='/explore'>
                    <Button
                        mx={2}
                        size='sm'
                        variant={router.pathname === '/explore' ? 'solid' : 'ghost'}
                    >
                      Explore
                    </Button>
                  </Link>
                </Show>
              </Flex>
            </Box>
            <Spacer />
            <Button variant='ghost' onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon /> }
            </Button>
            {
              !metamask && (
                  <Badge p={1} fontSize="0.6rem" ml={2} mr={4} colorScheme='orange' borderRadius='md'>
                    No Metamask
                  </Badge>
              )
            }
            {
                connected && profile && (
                    <Menu>
                      <MenuButton>
                        <Box p='4'>
                          <Image
                              src={profile.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                              alt="user profile picture"
                              objectFit="cover"
                              boxSize="2.5rem"
                              borderRadius='full'
                          />
                        </Box>
                      </MenuButton>
                      <MenuList>
                        <MenuItem>
                          My Profile
                        </MenuItem>
                      </MenuList>
                    </Menu>
                )
            }
            {
                !connected && metamask && (
                    <div>
                      <Box pr={4} pl={2}>
                        <Button colorScheme="teal" onClick={signIn}>Login</Button>
                      </Box>
                    </div>
                )
            }
            {
                connected && !profile && (
                    <Badge p={1} fontSize="0.6rem" ml={2} mr={4} colorScheme='teal' borderRadius='md'>
                      No Lens profile
                    </Badge>
                )
            }
          </Flex>
        </nav>
      </Box>
  )
}
