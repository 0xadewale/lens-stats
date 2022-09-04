import {Component} from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel, Image,
    Input
} from "@chakra-ui/react";
import Select from "../../ui/Select";
import {ethers, providers} from "ethers";

import ABI from '../../../abi/erc20.json'
import PostSelector from '../PostSelector'
import { createClient, whoCollectedPublication } from '../../../api'
import DataTable from 'react-data-table-component'

const columns = [
    {
        name: 'Id',
        selector: row => row.defaultProfile.id,
        width: '5rem'
    },
    {
        name: 'User',
        selector: row => <div className='flex gap-2 items-center'>
            <div>
                {
                    row.defaultProfile.picture && row.defaultProfile.picture.original ? (
                        <Image
                            src={row.defaultProfile.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
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
            <div className="flex flex-col gap-2">
                <div className="font-semibold">{row.defaultProfile.name}</div>
                <div className="font-thin text-gray-500">{row.defaultProfile.handle}</div>
            </div>
        </div>
    }
]

export default class PostCollectorModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCurrency: null,
            selectedPost: null,
            amount: 0,
            balance: 0,
            entries: [],
            winner: null
        }
    }

    handleCurrencySelected = async (currency) => {
        this.setState({ selectedCurrency: currency })
        await this.getAmount(currency)
    }

    handlePostSelected = async (post) => {
        this.setState({ selectedPost: post })
        const collectors = await this.getWhoCollectedPublication(post)
        this.setState({ entries: collectors })
    }

    getWhoCollectedPublication = async (pub) => {
        const client = await createClient()
        let entries = []
        let total = 0

        let response = await client.query(whoCollectedPublication, {
            // request: { publicationId: pub.id }
            request: { publicationId: '0x05-0x015e' }
        }).toPromise()

        entries = response.data.whoCollectedPublication.items
        total = response.data.whoCollectedPublication.pageInfo.totalCount
        let cursor = response.data.whoCollectedPublication.pageInfo.next

        while (entries.length < total) {
            let response = await client.query(whoCollectedPublication, {
                // request: { publicationId: pub.id }
                request: {
                    publicationId: '0x05-0x015e',
                    cursor
                }
            }).toPromise()
            cursor = response.data.whoCollectedPublication.pageInfo.next
            entries.push(...response.data.whoCollectedPublication.items)
        }
        return entries.filter(x => x.defaultProfile !== null)
    }

    handleAmountChange = (e) => {
        this.setState( { amount: e.target.value })
    }

    getAmount = async (currency) => {
        const provider = new providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const tokenContract = new ethers.Contract(currency.address, ABI, provider)
        const contractWithSigner = await tokenContract.connect(signer)
        const res = await contractWithSigner.balanceOf(this.props.address)
        const ethRes = ethers.utils.formatEther(res)
        const balance = Number.parseFloat(ethRes).toFixed(6)
        this.setState( { balance: balance.toString().replace('.000000', '') })
    }

    send = async () => {
        const provider = new providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const tokenContract = new ethers.Contract(this.state.selectedCurrency.address, ABI, provider)

        const amount = ethers.utils.parseUnits(this.state.amount, this.state.selectedCurrency.decimals)
        console.log(amount.toString())
        const contractWithSigner = await tokenContract.connect(signer)

        try {
            let tx = await contractWithSigner.transfer(winner, amount)
            console.log(tx)
            await tx.wait()
        } catch (e) {
            console.log(e)
        }

        if (this.state.selectedCurrency && this.amount > 0) {
        }
    }

    render() {
        return (
            <div>
                <div className="flex flex-col md:flex-row my-4 gap-4">
                    <FormControl className="z-20">
                        <FormLabel className="font-semibold">Currency</FormLabel>
                        <div className="block -z-10">
                            { this.state.selected?.name }
                            <Select
                                list={this.props.currencies}
                                selected={this.state.selectedCurrency}
                                onSelect={this.handleCurrencySelected}
                            />
                        </div>
                    </FormControl>
                    <FormControl position='initial'>
                        <FormLabel>
                            <div className="flex items-center justify-between">
                                <div>Amount</div>
                                <div className="font-thin text-gray-500">Balance : {this.state.balance}</div>
                            </div>
                        </FormLabel>
                        <Input position='initial' type='number' onChange={this.handleAmountChange} />
                    </FormControl>
                </div>
                <div className="flex w-full my-4">
                    <PostSelector
                        posts={this.props.publications}
                        selected={this.state.selectedPost}
                        onSelect={this.handlePostSelected}
                        profile={this.props.profile}
                        entries={this.state.entries}
                    />
                </div>
                {
                    this.state.entries.length > 0 && (
                        <div className="flex my-4">
                            <FormControl>
                                <FormLabel>Entries</FormLabel>
                                <div className="mx-2">
                                    <DataTable
                                        columns={columns}
                                        data={this.state.entries}
                                        pagination
                                        theme='dark'
                                    />
                                </div>
                            </FormControl>
                        </div>
                    )
                }
                <div className="flex mt-4 z-10">
                    <Button colorScheme='teal' w={{ base: 'full', sm: 'auto' }} onClick={this.send}>Giveaway</Button>
                </div>
            </div>
        )
    }
}
