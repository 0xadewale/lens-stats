import { useRouter } from 'next/router'
import { useState, useEffect, useContext } from 'react'
import {
  createClient,
  fetchProfile,
  doesFollow as doesFollowQuery,
  createUnfollowTypedData,
  LENS_HUB_CONTRACT_ADDRESS,
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
  Image,
  Spacer,
  Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber,
  Text,
  useColorModeValue
} from "@chakra-ui/react";

export default function Profile() {
  const [profile, setProfile] = useState()
  const [publications, setPublications] = useState([])
  const [doesFollow, setDoesFollow] = useState()
  const [loadedState, setLoadedState] = useState('')
  const router = useRouter()
  const context = useContext(AppContext)
  const { id } = router.query
  const { userAddress, profile: userProfile } = context

  useEffect(() => {
    if (id) {
      getProfile()
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
      console.log(profileData)
      setPublications(publicationData)
      setLoadedState('loaded')
    } catch (err) {
      console.log('error fetching profile...', err)
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

  function editProfile() {
    router.push('/edit-profile')
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
                h={{ sm: '15rem', md: '20rem' }}
            />
        ) : (
            <Box
                bg={profile.color}
                w='full'
                h={{ sm: '10rem', md: '15rem' }}
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
                      ml={{ base: 6, md: '4rem'}}
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
                <Heading fontSize={'2xl'} fontFamily={'body'} mb={4}>
                  { profile.handle }
                </Heading>
                <Flex>
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
              <Spacer />
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
    </div>
  )
}

const bioStyle = css`
  font-weight: 500;
`

const emptyPostTextStyle = css`
  text-align: center;
  margin: 0;
`

const emptyPostContainerStyle = css`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, .15);
  padding: 25px;
  border-radius: 8px;
`

const emptyPostHandleStyle = css`
  font-weight: 600;
`

const postHeaderStyle = css`
  margin: 0px 0px 15px;
`

const publicationWrapper = css`
  background-color: white;
  margin-bottom: 15px;
  padding: 5px 25px;
  border-radius: 15px;
  border: 1px solid #ededed;
`

const publicationContentStyle = css`
  line-height: 26px;
`

const nameStyle = css`
  margin: 15px 0px 5px;
`

const handleStyle = css`
  margin: 0px 0px 5px;
  color: #b900c9;
`

const headerStyle = css`
  width: 900px;
  max-height: 300px;
  height: 300px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
`

const profileImageStyle = css`
  width: 200px;
  height: 200px;
  max-width: 200px;
  border: 10px solid white;
  border-radius: 12px;
`

const columnWrapperStyle = css`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
`

const rightColumnStyle = css`
  margin-left: 20px;
  flex: 1;
`

const containerStyle = css`
  padding-top: 50px;
`

const buttonStyle = css`
  border: 2px solid rgb(249, 92, 255);
  outline: none;
  margin-top: 15px;
  color: rgb(249, 92, 255);
  padding: 13px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all .35s;
  font-weight: 700;
  width: 100%;
  letter-spacing: .75px;
  &:hover {
    background-color: rgb(249, 92, 255);
    color: white;
  }
`
