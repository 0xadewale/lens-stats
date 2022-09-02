import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import {
  createClient,
  fetchProfile,
  doesFollow as doesFollowQuery,
  getPublications,
  createUnfollowTypedData,
  LENS_HUB_CONTRACT_ADDRESS, whoCollectedPublication,
} from '../../api'
import { ethers } from 'ethers'
import { css } from '@emotion/css'
import { AppContext } from '../../context'
import { getSigner } from '../../utils'
import ReactMarkdown from 'react-markdown'

import LENSHUB from '../../abi/lenshub.json'
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Image, Skeleton,
  Spacer,
  Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import {TopUserCard} from "../../components/TopUserCard";

export default function Profile() {
  const [profile, setProfile] = useState()
  const [publications, setPublications] = useState([])
  const [doesFollow, setDoesFollow] = useState()
  const [loadedState, setLoadedState] = useState('')
  const [bestCollector, setBestCollector] = useState()
  const [bestCommentary, setBestCommentary] = useState()
  const router = useRouter()
  const context = useContext(AppContext)
  const { id } = router.query
  const { userAddress, profile: userProfile } = context

  useEffect(() => {
    if (id) {
      getProfile().then((res) => {
        getStats(res)
      })
    }
    if (id && userAddress) {
      checkDoesFollow()
    }
  }, [id, userAddress])

  async function unfollow() {
    try {
      const client = await createClient()
      const response = await client.mutation(createUnfollowTypedData, {
        request: { profile: id }
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
      } = await fetchProfile(id)
      setProfile(profileData)
      setPublications(publicationData)
      return publicationData
    } catch (err) {
      console.log('error fetching profile...', err)
    }
  }

  async function getStats(pubs) {
    try {
      const client = await createClient()
      let collectors = {}
      let comments = {}
      for (const publication of pubs) {
        const collectorResponse = await client.query(whoCollectedPublication, {
          request: { publicationId: publication.id }
        }).toPromise()
        const items = collectorResponse.data.whoCollectedPublication.items
        for (let i = 0; i < items.length; i++){
          collectors[items[i].defaultProfile?.id] ?
              collectors[items[i].defaultProfile?.id].collects.push(publication) :
              collectors[items[i].defaultProfile?.id] = { collects: [publication], defaultProfile: items[i].defaultProfile }
        }
        const commentsResponse = await getComments(publication.id)
        for (let i = 0; i < commentsResponse.length; i++){
          comments[commentsResponse[i].profile?.id] ?
              comments[commentsResponse[i].profile?.id].comments.push(publication) :
              comments[commentsResponse[i].profile?.id] = { comments: [publication], profile: commentsResponse[i].profile }
        }
      }
      delete collectors['undefined']
      let array = Object.keys(collectors).map((key) => {
        return collectors[key]
      })
      if (array.length > 0) {
        let best = array.reduce((prev, current) => (prev.collects.length > current.collects.length) ? prev : current)
        setBestCollector(best.defaultProfile)
      } else {
        setBestCollector(null)
      }
      delete comments['undefined']
      array = Object.keys(comments).map((key) => {
        return comments[key]
      })
      if (array.length > 0) {
        let best = array.reduce((prev, current) => (prev.comments.length > current.comments.length) ? prev : current)
        setBestCommentary(best.profile)
      } else {
        setBestCommentary(null)
      }
      setLoadedState('loaded')
    } catch (err) {
      console.log('error fetching stats...', err)
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
            profileId: id
          }]
        }
      }
    ).toPromise()
    setDoesFollow(response.data.doesFollow[0].follows)
  }

  async function followUser() {
    const contract = new ethers.Contract(
      LENS_HUB_CONTRACT_ADDRESS,
      LENSHUB,
      getSigner()
    )

    try {
      const tx = await contract.follow([id], [0x0])
      setTimeout(() => {
        setDoesFollow(true)
      }, 2500)
      await tx.wait()
      console.log(`successfully followed ... ${profile.handle}`)
    } catch (err) {
      console.log('error: ', err)
    }
  }

  async function getComments(id) {
    try {
      const client = await createClient()
      const comments = await client.query(getPublications, {
        request: { commentsOf: id }
      }).toPromise()
      return comments.data.publications.items
    } catch (err) {
      console.log('Error fetching comments...', err)
    }
  }

  if (!profile) return null

  const profileOwner = userProfile?.id === id

  return (
    <div>
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
            <Flex w='full' alignItems='center' flexDirection={{ base: 'column', md: 'row'}}>
              <Box p={4}>
                <Heading textAlign={{ base: 'center', md: 'left'}} fontSize={'2xl'} fontFamily={'body'} mb={4}>
                  { profile.handle }
                </Heading>
                <Flex justify='center' textAlign={{ base: 'center', md: 'left'}}>
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
              </Box>
              <Box>
                {
                  userAddress && !profileOwner ? (
                      doesFollow ? (
                          <Button
                              mr={2}
                              colorScheme='red'
                              variant='solid'
                              onClick={unfollow}
                          >
                            Unfollow
                          </Button>
                      ) : (
                          <Button
                              mr={2}
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
          {
            loadedState === 'loaded' ? (
                    <Flex alignItems='center' justify={{ base: 'center', md: 'center'}} flexDirection={{ base: 'column', md: 'row'}}>
                      {
                        bestCollector ? (
                              <TopUserCard label='Top collector' user={bestCollector} />
                          ) : (
                              <Box
                                  h='25rem'
                                  w='20rem'
                                  rounded={'md'}
                                  borderWidth={1}
                                  borderRadius='lg'
                                  mx={4}
                              >
                                <Center h='full'>
                                  No Top collector
                                </Center>
                              </Box>
                        )
                      }
                      {
                        bestCommentary ? (
                              <TopUserCard label='Top commentary' user={bestCommentary} />
                          ): (
                            <Box
                                h='25rem'
                                w='20rem'
                                rounded={'md'}
                                borderWidth={1}
                                borderRadius='lg'
                                mx={4}
                            >
                              <Center h='full'>
                                No Top commentary
                              </Center>
                            </Box>
                        )
                      }
                    </Flex>
            ) :
                <Flex alignItems='center' justify={{ base: 'center', md: 'center'}} flexDirection={{ base: 'column', md: 'row'}}>
                  <Skeleton
                      h='25rem'
                      w='20rem'
                      rounded={'md'}
                      borderWidth={1}
                      borderRadius='lg'
                      mx={4}
                  />
                  <Skeleton
                      h='25rem'
                      w='20rem'
                      rounded={'md'}
                      borderWidth={1}
                      borderRadius='lg'
                      mx={4}
                  />
                </Flex>
          }
        </Box>
      </Flex>
    </div>
  )
}
