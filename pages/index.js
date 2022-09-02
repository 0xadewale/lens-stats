import { useState, useEffect, useContext } from 'react'
import { createClient, basicClient, searchPublications, globalProtocolStats, timeline } from '../api'
import { css } from '@emotion/css'
import { ethers } from 'ethers'
import { trimString, generateRandomColor } from '../utils'
import { AppContext } from '../context'
import Link from 'next/link'
import {
  Container,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Show
} from '@chakra-ui/react'
import Image from 'next/image'

const typeMap = {
  Comment: "Comment",
  Mirror: "Mirror",
  Post: "Post"
}

export default function Home() {
  const [stats, setStats] = useState([])
  const [loadingState, setLoadingState] = useState('loading')
  const [searchString, setSearchString] = useState('')
  const { profile } = useContext(AppContext)
  const [metamask, setMetamask] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [profile])

  async function fetchStats() {
    try {
      const response = await basicClient.query(globalProtocolStats).toPromise()
      console.log(response)
      const stats = response.data.globalProtocolStats
      setStats(stats)
      setLoadingState('loaded')
    } catch (error) {
      console.log({ error })
    }
  }

  function numberWithSpaces(x) {
    let float = Number.parseFloat(x).toFixed(3)
    let parts = float.toString().split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    return parts.join(".").replace('.000', '')
  }

  async function searchForPost() {
    setLoadingState('')
    try {
      const urqlClient = await createClient()
      const response = await urqlClient.query(searchPublications, {
        query: searchString, type: 'PUBLICATION'
      }).toPromise()
      const postData = response.data.search.items.filter(post => {
        if (post.profile) {
          post.backgroundColor = generateRandomColor()
          return post
        }
      })

      setPosts(postData)
      if (!postData.length) {
        setLoadingState('no-results')
      }
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <div>
      <Container maxW='2xl'>
        {
          loadingState === 'no-results' && (
            <h2>No results....</h2>
          )
        }
        <Text fontSize='4xl'>Lens Protocole Stats</Text>
        {
          loadingState === 'loaded' && (
              <div>
                <StatGroup mt={2}>
                  <Stat>
                    <StatLabel>Profiles</StatLabel>
                    <StatNumber>{ numberWithSpaces(stats.totalProfiles) }</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Posts</StatLabel>
                    <StatNumber>{ numberWithSpaces(stats.totalPosts) }</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Follows</StatLabel>
                    <StatNumber>{ numberWithSpaces(stats.totalFollows) }</StatNumber>
                  </Stat>
                </StatGroup>
                <StatGroup mt={2} mb={4}>
                  <Stat>
                    <StatLabel>Mirror</StatLabel>
                    <StatNumber>{ numberWithSpaces(stats.totalMirrors) }</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Collect</StatLabel>
                    <StatNumber>{ numberWithSpaces(stats.totalCollects) }</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Comments</StatLabel>
                    <StatNumber>{ numberWithSpaces(stats.totalComments) }</StatNumber>
                  </Stat>
                </StatGroup>
                <TableContainer>
                  <Table variant='simple'>
                    <Thead>
                      <Tr>
                        <Th colSpan={3}>Total Revenue</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {
                          stats.totalRevenue && stats.totalRevenue.map((revenu, index) => (
                              <Tr key={index}>
                                <Td>
                                  <Image
                                      src={`/assets/${revenu.asset.symbol.toLowerCase()}.svg`}
                                      alt="asset token image"
                                      width={30}
                                      height={30}
                                  />
                                </Td>
                                <Show above='md'>
                                  <Td>{ revenu.asset.name}</Td>
                                </Show>
                                <Td>{ numberWithSpaces(revenu.value) } { revenu.asset.symbol }</Td>
                              </Tr>
                          ))
                      }
                    </Tbody>
                  </Table>
                </TableContainer>
              </div>
            )
        }
      </Container>
    </div>
  )
}
