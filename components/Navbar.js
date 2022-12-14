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
import Image from "next/image";

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
          <div className="flex items-center gap-2">
            <Box p='4'>
              <div className="flex items-center gap-2">
                <Show below='md'>
                  <Button
                      variant='ghost'
                      onClick={toggleIsOpen}
                      aria-label="Menu Button"
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
                  <Link href="/">
                    <Image
                        className="cursor-pointer"
                        src="/icon.webp"
                        alt="Lenstats icon"
                        width={40}
                        height={40}
                    />
                  </Link>
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
                        size='sm'
                        variant={router.pathname === '/' ? 'solid' : 'ghost'}
                    >
                      Home
                    </Button>
                  </Link>
                  <Link href='/leaderboard'>
                    <Button
                        size='sm'
                        variant={router.pathname === '/leaderboard' ? 'solid' : 'ghost'}
                    >
                      Leaderboard
                    </Button>
                  </Link>
                  <Link href='/giveaway'>
                    <Button
                        size='sm'
                        variant={router.pathname === '/giveaway' ? 'solid' : 'ghost'}
                    >
                      Giveaway
                    </Button>
                  </Link>
                  <Link href='/explore'>
                    <Button
                        size='sm'
                        variant={router.pathname === '/explore' ? 'solid' : 'ghost'}
                    >
                      Explore
                    </Button>
                  </Link>
                </Show>
              </div>
            </Box>
            <Spacer />
            <Button mr={2} variant='ghost' aria-label="Theme button" onClick={toggleColorMode}>
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
          </div>
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
                    <Link href='/leaderboard'>
                      <div className={`h-25 cursor-pointer my-1 py-1 pl-2 text-teal-800 font-semibold rounded-md w-full hover:bg-teal-100 ${router.pathname === '/leaderboard' ? 'bg-teal-100' : ''}`}>
                        Leaderboard
                      </div>
                    </Link>
                  </div>
                  <div>
                    <Link href='/giveaway'>
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
