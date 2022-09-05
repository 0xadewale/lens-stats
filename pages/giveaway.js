import { Badge, Box, Button, FormControl, FormLabel, Image, Text, useColorModeValue } from "@chakra-ui/react";
import ModuleSelector from "../components/Giveaway/ModuleSelector";
import {useContext, useEffect, useState} from "react";
import BestModule from "../components/Giveaway/Form/BestModule";
import {AppContext} from "../context";
import {createClient, getPublications, getStats} from "../api";
import PostCollectorModule from "../components/Giveaway/Form/PostCollectorModule";


const currencies = [
    {
        name: "Wrapped Matic",
        symbol: "WMATIC",
        decimals: 18,
        address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
    },
    {
        name: "Wrapped Ether",
        symbol: "WETH",
        decimals: 18,
        address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    },
    {
        name: "(PoS) Dai Stablecoin",
        symbol: "DAI",
        decimals: 18,
        address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    },
    {
        name: "USD Coin (PoS)",
        symbol: "USDC",
        decimals: 6,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    }
]

export default function Giveaway({signIn}) {
    const [selected, setSelected] = useState();
    const [stats, setStats] = useState()
    const [loadedState, setLoadedState] = useState('')
    const [publications, setPublications] = useState([])
    const context = useContext(AppContext)
    const theme = useColorModeValue('light', 'dark')
    const { userAddress, profile: userProfile } = context

    useEffect(() => {
        if (userAddress && userProfile) {
            getUserStats()
        }
    }, [userAddress, userProfile])

    async function getUserStats() {
        const client = await createClient()
        const pubs = await client.query(getPublications, {
            request: {
                profileId: userProfile.id,
                publicationTypes: ['POST']
            }
        }).toPromise()
        setPublications(pubs.data.publications.items)
        const stats = await getStats(pubs.data.publications.items)
        setStats(stats)
        setLoadedState('loaded')
    }

    function handleSelected(item) {
        setSelected(item)
    }

    if (!userProfile && !userAddress) {
        return (
            <div className="container mx-auto">
                <div className="flex">
                    <Text fontSize="2xl" fontWeight='bold'>Community Giveaway</Text>
                </div>
                <div className="flex my-4">
                    <Button colorScheme="teal" onClick={signIn}>Login</Button>
                </div>
            </div>
        )
    }

    if (!userProfile && userAddress) {
        return (
            <div className="container mx-auto">
                <div className="flex">
                    <Text fontSize="2xl" fontWeight='bold'>Community Giveaway</Text>
                </div>
                <div className="flex my-4 items-center">
                    <Badge fontSize="0.6rem" mr={2} p={2} colorScheme='teal' borderRadius='md'>
                        No Lens profile
                    </Badge>
                    Sorry you need a Lens profile
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto">
            <div className="flex">
                <Text fontSize="2xl" fontWeight='bold'>Community Giveaway</Text>
            </div>
            <div className="flex my-4">
                <FormControl>
                    <FormLabel>Module</FormLabel>
                    <div className="flex items-center gap-2">
                        {
                            stats ? (
                                <ModuleSelector selected={selected} onSelect={handleSelected} />
                            ) : (
                                <Button isLoading variant='ghost'>Button</Button>
                            )
                        }
                        {
                            selected?.id === 1 && stats?.bestCollector && (
                                <div className="flex gap-2 items-center">
                                    <div>
                                        {
                                            stats.bestCollector.picture && stats.bestCollector.picture.original ? (
                                                <Image
                                                    src={stats.bestCollector.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
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
                                    <div className="font-semibold">{ stats.bestCollector.name }</div>
                                </div>
                            )
                        }
                        {
                            selected?.id === 2 && stats?.bestCommentator && (
                                <div className="flex gap-2 items-center">
                                    <div>
                                        {
                                            stats.bestCommentator.picture && stats.bestCommentator.picture.original ? (
                                                <Image
                                                    src={stats.bestCommentator.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
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
                                    <div className="font-semibold">{ stats.bestCommentator.name }</div>
                                </div>
                            )
                        }
                    </div>
                </FormControl>
            </div>
            {(() => {
                if (selected) {
                    switch (selected.id) {
                        case 1:
                            return <BestModule
                                label={selected.name}
                                winner={stats.bestCollector}
                                address={userAddress}
                                currencies={currencies}
                            />
                        case 2:
                            return <BestModule
                                label={selected.name}
                                winner={stats.bestCommentator}
                                address={userAddress}
                                currencies={currencies}
                                />
                        case 3:
                            return <PostCollectorModule
                                label={selected.name}
                                publications={publications}
                                address={userAddress}
                                currencies={currencies}
                                profile={userProfile}
                                theme={theme}
                                />
                        default:
                            return <div className="text-gray-500">Comming Soon</div>
                    }
                }
            })()}
        </div>
    )
}
