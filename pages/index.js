import { useState, useEffect, useContext } from 'react'
import { basicClient, globalProtocolStats } from '../api'
import { AppContext } from '../context'
import {
  Container,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Show
} from '@chakra-ui/react'
import Image from 'next/image'
import Seo from '../components/utils/Seo'

export default function Home() {
  const [stats, setStats] = useState([])
  const [loadingState, setLoadingState] = useState('loading')
  const { profile } = useContext(AppContext)

  useEffect(() => {
    fetchStats()
  }, [profile])

  async function fetchStats() {
    try {
      const response = await basicClient.query(globalProtocolStats).toPromise()
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

  return (
    <div>
      <Seo />
      <Container maxW='2xl'>
        {
          loadingState === 'no-results' && (
            <h2>No results....</h2>
          )
        }
        <h1 className="text-4xl" >Lens Protocole Stats</h1>
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
