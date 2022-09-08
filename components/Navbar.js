import Link from 'next/link'
import { useRouter } from 'next/router'
import {Badge, Show, useColorMode} from '@chakra-ui/react'
import {SunIcon, MoonIcon, HamburgerIcon, CloseIcon} from '@chakra-ui/icons'
import { useState } from 'react'
import {
  Flex,
  Box,
  Spacer,
  Input,
  Button
} from '@chakra-ui/react'
import AccountDropdown from "./AccountDropdown";

export function Navbar({
    connected,
    profile,
    metamask,
    signIn
}) {
  const { colorMode, toggleColorMode } = useColorMode()
  const router = useRouter()
  const [searchText, setSearchText] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  let inputHandler = (e) => {
    setSearchText(e.target.value)
  }

  let toggleIsOpen = () => {
    setIsOpen(!isOpen)
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
                <Show below='md'>
                  <Button
                      mr={4}
                      variant='ghost'
                      onClick={toggleIsOpen}
                  >
                    {
                      isOpen ? (
                          <CloseIcon />
                      ) : (
                          <HamburgerIcon />
                      )
                    }
                  </Button>
                </Show>
                <Show above='md'>
                  <Box mr={2}>
                    <Link href="/">
                      <a>Lens Stats</a>
                    </Link>
                  </Box>
                </Show>
                <Box>
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
            <Button mr={2} variant='ghost' onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon /> }
            </Button>
            {
              metamask ? (
                  <div>
                    {
                      connected ? (
                          <div>
                            {
                                profile ? (
                                    <AccountDropdown profile={profile} />
                                ) : (
                                    <Badge p={1} fontSize="0.6rem" mr={4} colorScheme='teal' borderRadius='md'>
                                      No Lens profile
                                    </Badge>
                                )
                            }
                          </div>
                      ) : (
                            <Box pr={4}>
                              <Button colorScheme="teal" onClick={signIn}>Login</Button>
                            </Box>
                        )
                    }
                  </div>
              ) : (
                  <Badge p={1} fontSize="0.6rem" mr={4} colorScheme='orange' borderRadius='md'>
                    No Web3 provider
                  </Badge>
              )
            }
          </Flex>
        </nav>
        {
          isOpen && (
              <Show below='md'>
                <Flex w='full' flexDirection='column' px={8}>
                  <div>
                    <Link href='/'>
                      <div className={`h-25 cursor-pointer my-1 py-1 pl-2 text-teal-800 font-semibold rounded-md w-full hover:bg-teal-100 ${router.pathname === '/' ? 'bg-teal-100' : ''}`}>
                        Home
                      </div>
                    </Link>
                  </div>
                  <div>
                    <Link href='/Index'>
                      <div className={`h-25 cursor-pointer my-1 py-1 pl-2 text-teal-800 font-semibold rounded-md w-full hover:bg-teal-100 ${router.pathname === '/giveaway' ? 'bg-teal-100' : ''}`}
                      >
                        Giveaway
                      </div>
                    </Link>
                  </div>
                  <div>
                    <Link href='/explore'>
                      <div
                          className={`h-25 cursor-pointer my-1 py-1 pl-2 text-teal-800 font-semibold rounded-md w-full hover:bg-teal-100 ${router.pathname === '/explore' ? 'bg-teal-100' : ''}`}
                      >
                        Explore
                      </div>
                    </Link>
                  </div>
                </Flex>
              </Show>
            )
        }
      </Box>
  )
}
