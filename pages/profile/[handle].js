import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import {
  createClient,
  fetchProfile,
  doesFollow as doesFollowQuery,
  getStats,
  createUnfollowTypedData,
  LENS_HUB_CONTRACT_ADDRESS, profilePublicationRevenue, profileFollowRevenue, mutualFollowersProfiles,
} from '../../api'
import { ethers } from 'ethers'
import { AppContext } from '../../context'
import { getSigner } from '../../utils'

import LENSHUB from '../../abi/lenshub.json'
import {
  Box,
  Button,
  Center,
  Flex,
  Heading, Hide,
  Image, Show, Skeleton,
  Stat, StatGroup, StatLabel, StatNumber,
  Text
} from "@chakra-ui/react";
import {TopUserCard} from "../../components/TopUserCard";
import Seo from '../../components/utils/Seo'
import { APP_NAME } from '../../constants'
import { UserRevenuCard } from '../../components/UserRevenuCard'
import Modal from '../../components/ui/Modal'
import Link from 'next/link'

export default function Profile() {
  const [profile, setProfile] = useState()
  const [doesFollow, setDoesFollow] = useState()
  const [mutualFollowers, setMultualFollowers] = useState()
  const [profileRevenue, setProfileRevenue] = useState()
  const [followRevenue, setFollowRevenue] = useState()
  const [loadedState, setLoadedState] = useState('')
  const [bestCollector, setBestCollector] = useState()
  const [bestCommentator, setBestCommentator] = useState()
  const [openModal, setOpenModal] = useState(false)
  const router = useRouter()
  const context = useContext(AppContext)
  const { handle } = router.query
  const { userAddress, profile: userProfile } = context

  useEffect(() => {
    if (handle) {
      getProfile().then((res) => {
        getUserStats(res)
      })
    }
  }, [handle])

  useEffect(() => {
    if (profile) {
      getProfileRevenue()
      getFollowReveue()
      if (userAddress) {
        checkDoesFollow()
        getMultualFollowers()
      }
    }
  }, [profile, userAddress, userProfile])

  let closeModal = () => {
    setOpenModal(false)
  }

  async function unfollow() {
    try {
      const client = await createClient()
      const response = await client.mutation(createUnfollowTypedData, {
        request: { profile: profile.id }
      }).toPromise()
      const typedData = response.data.createUnfollowTypedData.typedData
      const contract = new ethers.Contract(
        typedData.domain.verifyingContract,
        LENSHUB,
        getSigner()
      )
      const tx = await contract.burn(typedData.value.tokenId)
      setTimeout(() => {
        setDoesFollow(false)
      }, 2500)
      await tx.wait()
      console.log(`successfully unfollowed ... ${profile.handle}`)
      } catch (err) {
        console.log('error:', err)
      }
  }

  async function getProfile() {
    try {
      const {
        profile: profileData, publications: publicationData
      } = await fetchProfile(handle)
      setProfile(profileData)
      return publicationData
    } catch (err) {
      console.log('error fetching profile...', err)
    }
  }

  async function getUserStats(pubs) {
    try {
      let stats = await getStats(pubs)
      setBestCollector(stats.bestCollector)
      setBestCommentator(stats.bestCommentator)
      setLoadedState('loaded')
    } catch (err) {
      console.log('error fetching stats...', err)
    }
  }

  async function getProfileRevenue() {
    try {
      let revenue = {
        WMATIC: {
          asset: {
            name: "Wrapped Matic",
            symbol: 'WMATIC'
          },
          total: 0
        },
        WETH: {
          asset: {
            name: "Wrapped Ether",
            symbol: "WETH"
          },
          total: 0
        },
        DAI: {
          asset: {
            name: "(PoS) Dai Stablecoin",
            symbol: "DAI"
          },
          total: 0
        },
        USDC: {
          asset: {
            name: "USD Coin (PoS)",
            symbol: "USDC"
          },
          total: 0
        },
        NCT: {
          asset: {
            name: "Toucan Protocol: Nature Carbon Tonne",
            symbol: "NCT"
          },
          total: 0
        }
      }
      let client = await createClient()
      const response = await client.query(profilePublicationRevenue, {
        request: {
          profileId: profile.id
        }
      }).toPromise()
      const items = response.data.profilePublicationRevenue.items
      for (let i = 0; i < items.length; i++) {
        revenue[items[i].revenue.total.asset.symbol].total += parseInt(items[i].revenue.total.value)
      }
      setProfileRevenue(Object.values(revenue))
    } catch (err) {
      console.log('error fetching revenue...', err)
    }
  }

  async function getFollowReveue() {
    try {
      let revenue = {
        WMATIC: {
          asset: {
            name: "Wrapped Matic",
            symbol: 'WMATIC'
          },
          total: 0
        },
        WETH: {
          asset: {
            name: "Wrapped Ether",
            symbol: "WETH"
          },
          total: 0
        },
        DAI: {
          asset: {
            name: "(PoS) Dai Stablecoin",
            symbol: "DAI"
          },
          total: 0
        },
        USDC: {
          asset: {
            name: "USD Coin (PoS)",
            symbol: "USDC"
          },
          total: 0
        },
        NCT: {
          asset: {
            name: "Toucan Protocol: Nature Carbon Tonne",
            symbol: "NCT"
          },
          total: 0
        }
      }
      let client = await createClient()
      const response = await client.query(profileFollowRevenue, {
        request: {
          profileId: profile.id
        }
      }).toPromise()
      const items = response.data.profileFollowRevenue.revenues
      for (let i = 0; i < items.length; i++) {
        revenue[items[i].total.asset.symbol].total += parseInt(items[i].total.value)
      }
      setFollowRevenue(Object.values(revenue))
    } catch (err) {
      console.log('error fetching revenue...', err)
    }
  }

  async function checkDoesFollow() {
    const urqlClient = await createClient()
    const response = await urqlClient.query(
      doesFollowQuery,
      {
        request: {
          followInfos: [{
            followerAddress: userAddress,
            profileId: profile.id
          }]
        }
      }
    ).toPromise()
    setDoesFollow(response.data.doesFollow[0].follows)
  }

  async function getMultualFollowers() {
    const urqlClient = await createClient()
    const response = await urqlClient.query(mutualFollowersProfiles, {
      viewingProfileId: profile.id, yourProfileId: userProfile.id
    }).toPromise()
    setMultualFollowers(response.data.mutualFollowersProfiles.items)
  }

  async function followUser() {
    const contract = new ethers.Contract(
      LENS_HUB_CONTRACT_ADDRESS,
      LENSHUB,
      getSigner()
    )

    try {
      const tx = await contract.follow([profile.id], [0x0])
      setTimeout(() => {
        setDoesFollow(true)
      }, 2500)
      await tx.wait()
      console.log(`successfully followed ... ${profile.handle}`)
    } catch (err) {
      console.log('error: ', err)
    }
  }

  if (!profile) return null

  const profileOwner = userProfile?.handle === handle

  return (
    <div>
      {profile?.name ? (
          <Seo title={`${profile?.name} | ${APP_NAME}`} />
      ) : (
          <Seo title={`@${profile?.handle} | ${APP_NAME}`} />
      )}
      {
        profile.coverPicture ? (
            <Image
                src={profile.coverPicture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                objectFit='cover'
                w='full'
                h={{ base: '15rem', md: '20rem' }}
            />
        ) : (
            <Box
                bg={profile.color}
                w='full'
                h={{ base: '10rem', md: '15rem' }}
            />
        )
      }
      <Flex>
        <Box bg='gray.100' _dark={{ bg: 'gray.900'}} pb={8} w='full'>
          <Flex flexDirection={{ base: 'column', md: 'row'}} alignItems={{ base: 'center', md: ''}}>
            {
              profile.picture ? (
                  <Image
                      src={profile.picture.original?.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                      w={{ base: '10rem', md: '15rem' }}
                      h={{ base: '10rem', md: '15rem' }}
                      borderRadius='xl'
                      ml={{ base: 0, md: '4rem'}}
                      mt={{ base: '-2rem', md: '-4rem'}}
                  />
                ) : (
                  <Box
                      w={{ base: '10rem', md: '15rem' }}
                      h={{ base: '10rem', md: '15rem' }}
                      borderRadius='xl'
                      ml={{ base: 6, md: '4rem'}}
                      mt={{ base: '-2rem', md: '-4rem'}}
                      bg='gray.500'
                  />
              )
            }
            <Flex w='full'  justify='space-between' alignItems='center' flexDirection={{ base: 'column', md: 'row'}}>
              <Box p={4}>
                <Heading textAlign={{ base: 'center', md: 'left'}} fontSize={'2xl'} fontFamily={'body'} mb={4}>
                  { profile.handle }
                </Heading>
                <Flex justify={{ base: 'center', md: 'left'}} textAlign={{ base: 'center', md: 'left'}}>
                  <Box>
                    <Text fontWeight={600}>
                      { profile.stats.totalFollowers }
                    </Text>
                    <Text fontWeight={500} color={'gray.500'} size="sm">
                      Followers
                    </Text>
                  </Box>
                  <Box ml={4}>
                    <Text fontWeight={600}>
                      { profile.stats.totalFollowing }
                    </Text>
                    <Text fontWeight={500} color={'gray.500'} size="sm">
                      Following
                    </Text>
                  </Box>
                  <Box ml={4}>
                    <Text fontWeight={600}>
                      { profile.stats.totalPublications }
                    </Text>
                    <Text fontWeight={500} color={'gray.500'} size="sm">
                      Publications
                    </Text>
                  </Box>
                </Flex>
                <Flex mt={2}>
                  <Box>
                    {
                        mutualFollowers && mutualFollowers.length > 0 (
                            <div
                                className="flex flex-row items-center gap-1 text-sm font-light cursor-pointer hover:underline text-gray-700 dark:text-gray-300"
                                onClick={() => setOpenModal(true)}
                            >
                              Follwed by {
                              mutualFollowers.slice(0, 2).map((item, index) => (
                                  <>
                                    <Show below="md">
                                      {
                                        index === 1 ? (
                                            <>{item.handle}</>
                                        ) : (
                                            <>{item.handle}, </>
                                        )
                                      }
                                    </Show>
                                    <Show above="md">
                                      <div key={index} className="flex items-center gap-1">
                                        {
                                            item.picture && (
                                                <Image
                                                    src={item.picture.original?.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                                                    w={'1.5rem'}
                                                    h={'1.5rem'}
                                                    borderRadius='full'
                                                    className='hidden md:block'
                                                />
                                            )
                                        }
                                        <span>{item.handle}</span>
                                      </div>
                                    </Show>
                                  </>
                              ))
                            }
                              {
                                mutualFollowers.length > 2 && (
                                    <>and {mutualFollowers.length - 2} more users your follow</>
                                  )
                              }
                            </div>
                        )
                    }
                  </Box>
                </Flex>
              </Box>
              <Box>
                {
                  userAddress && !profileOwner ? (
                      doesFollow ? (
                          <Button
                              mr={4}
                              colorScheme='red'
                              variant='solid'
                              onClick={unfollow}
                          >
                            Unfollow
                          </Button>
                      ) : (
                          <Button
                              mr={4}
                              colorScheme='teal'
                              variant='solid'
                              onClick={followUser}
                          >
                            Follow
                          </Button>
                      )
                  ) : null
                }
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <Modal isOpen={openModal} onClose={closeModal} title="Followers you know">
        {
          mutualFollowers && mutualFollowers.map((user, index) => (
              <Link
                  href={`/profile/${user.handle}`}
                  key={index}
              >
                <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 my-2 p-2 rounded-md"
                    onClick={() => setOpenModal(false)}
                >
                  <div>
                    {
                      user.picture && user.picture.original ? (
                          <Image
                              src={user.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                              alt="user profile picture"
                              objectFit="cover"
                              boxSize="2.5rem"
                              borderRadius='full'
                          />
                      ) : (
                          <Box
                              bg='gray.500'
                              boxSize="2.5rem"
                              borderRadius='full'
                          />
                      )
                    }
                  </div>
                  <div>
                    <div className="flex">
                      <div className="font-semibold">{user.name}</div>
                    </div>
                    <div className="flex">
                      <div className="text-sm">{user.handle}</div>
                    </div>
                  </div>
                </div>
              </Link>
          ))
        }
      </Modal>
      <Flex mt={4}>
        <Box
            w='full'
            borderRadius='lg'
            borderWidth={1}
            mx={2}
            p={4}
            align='center'
        >
          <StatGroup>
            <Stat>
              <StatLabel>Posts</StatLabel>
              <StatNumber>{ profile.stats.totalPosts }</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Collects</StatLabel>
              <StatNumber>{ profile.stats.totalCollects }</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Comments</StatLabel>
              <StatNumber>{ profile.stats.totalComments }</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Mirrors</StatLabel>
              <StatNumber>{ profile.stats.totalMirrors }</StatNumber>
            </Stat>
          </StatGroup>
        </Box>
      </Flex>
      <Flex mt={4}>
        <Box p={4} w='full'>
          <div className="flex justify-center flex-col md:flex-row gap-4">
            {
                profileRevenue ? (
                    <UserRevenuCard revenue={profileRevenue} label="Total posts revenue" />
                ) : (
                    <Skeleton
                        h='26rem'
                        w='20rem'
                        rounded={'md'}
                        borderWidth={1}
                        borderRadius='lg'
                        mx={4}
                        my={6}
                    />
                )
            }
            {
                followRevenue ? (
                    <UserRevenuCard revenue={followRevenue} label="Total follow revenue" />
                ) : (
                    <Skeleton
                        h='26rem'
                        w='20rem'
                        rounded={'md'}
                        borderWidth={1}
                        borderRadius='lg'
                        mx={4}
                        my={6}
                    />
                )
            }
          </div>
          {
            loadedState === 'loaded' ? (
                    <Flex alignItems='center' justify={{ base: 'center', md: 'center'}} flexDirection={{ base: 'column', md: 'row'}}>
                      {
                        bestCollector ? (
                              <TopUserCard label='Top collector' user={bestCollector} />
                          ) : (
                              <Box
                                  h='26rem'
                                  w='20rem'
                                  rounded={'md'}
                                  borderWidth={1}
                                  borderRadius='lg'
                                  mx={4}
                                  py={6}
                              >
                                <Center h='full'>
                                  No Top collector
                                </Center>
                              </Box>
                        )
                      }
                      {
                        bestCommentator ? (
                              <TopUserCard label='Top commentator' user={bestCommentator} />
                          ): (
                            <Box
                                h='26rem'
                                w='20rem'
                                rounded={'md'}
                                borderWidth={1}
                                borderRadius='lg'
                                mx={4}
                                py={6}
                            >
                              <Center h='full'>
                                No Top commentator
                              </Center>
                            </Box>
                        )
                      }
                    </Flex>
            ) :
                <Flex alignItems='center' justify={{ base: 'center', md: 'center'}} flexDirection={{ base: 'column', md: 'row'}}>
                  <Skeleton
                      h='26rem'
                      w='20rem'
                      rounded={'md'}
                      borderWidth={1}
                      borderRadius='lg'
                      mx={4}
                      my={6}
                  />
                  <Skeleton
                      h='26rem'
                      w='20rem'
                      rounded={'md'}
                      borderWidth={1}
                      borderRadius='lg'
                      mx={4}
                      my={6}
                  />
                </Flex>
          }
        </Box>
      </Flex>
    </div>
  )
}
