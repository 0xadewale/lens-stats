import {Badge, Button, FormControl, FormHelperText, FormLabel, Input, Text} from "@chakra-ui/react";
import ModuleSelector from "../components/Giveaway/ModuleSelector";
import {useContext, useEffect, useState} from "react";
import BestCollector from "../components/Giveaway/Form/BestCollector";
import {AppContext} from "../context";
import {createClient, getPublications, getStats} from "../api";

export default function Giveaway({signIn}) {
    const [selected, setSelected] = useState();
    const [stats, setStats] = useState()
    const [loadedState, setLoadedState] = useState('')
    const context = useContext(AppContext)
    const { userAddress, profile: userProfile } = context

    useEffect(() => {
        if (userAddress && userProfile) {
            console.log('address', userAddress)
            console.log('profile', userProfile)
            getUserStats()
        }
    }, [userAddress, userProfile])

    async function getUserStats() {
        const client = await createClient()
        const pubs = await client.query(getPublications, {
            request: {
                profileId: id,
                publicationTypes: ['POST']
            }
        }).toPromise()
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
                    { userAddress }
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
                    <ModuleSelector selected={selected} onSelect={handleSelected} />
                </FormControl>
            </div>
            {(() => {
                switch (selected?.id) {
                    case 1:
                        return <BestCollector winner={stats.bestCollector} address={userAddress} />
                    default:
                        return <div className="text-gray-500">Comming Soon</div>
                }
            })()}
        </div>
    )
}