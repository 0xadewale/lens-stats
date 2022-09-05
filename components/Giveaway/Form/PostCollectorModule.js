import {Component} from "react";
import {
    Box,
    Button, Center, Flex,
    FormControl,
    FormLabel, Heading, Image,
    Input, Show, Spinner, Stack, Text, useColorModeValue
} from "@chakra-ui/react";
import Select from "../../ui/Select";
import {ethers} from "ethers";

import PostSelector from '../PostSelector'
import { createClient, getBalance, send, whoCollectedPublication } from '../../../api'
import DataTable, { createTheme } from 'react-data-table-component'

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
    },
    {
        name: 'Address',
        selector: row => row.defaultProfile.ownedBy
    }
]

createTheme('dark', {
    background: {
        default: 'transparent',
    }
});

export default class PostCollectorModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCurrency: null,
            selectedPost: null,
            loadingState: '',
            amount: 0,
            balance: 0,
            entries: [],
            winner: undefined,
            valid: false
        }
    }

    handleCurrencySelected = async (currency) => {
        this.setState({ selectedCurrency: currency })
        const balance = await getBalance(currency, this.props.address)
        this.setState( { balance: balance })
        this.validate(this.state.amount, balance)
    }

    handlePostSelected = async (post) => {
        this.setState({ selectedPost: post, loadingState: 'loading' })
        const collectors = await this.getWhoCollectedPublication(post)
        this.setState({ entries: collectors, winner: undefined })
        this.setState({ loadingState: 'loaded' })
    }

    validate = (value, balance) => {
        if (this.state.selectedCurrency !== null) {
            if (value > balance) {
                this.setState({ valid: false })
            } else {
                this.setState({ valid: true })
            }
        }
    }

    getWhoCollectedPublication = async (pub) => {
        console.log("theme", this.props.theme)
        const client = await createClient()
        let entries = []
        let total = 0

        let response = await client.query(whoCollectedPublication, {
            request: { publicationId: pub.id }
        }).toPromise()

        entries = response.data.whoCollectedPublication.items
        total = response.data.whoCollectedPublication.pageInfo.totalCount
        let cursor = response.data.whoCollectedPublication.pageInfo.next

        while (entries.length < total) {
            let response = await client.query(whoCollectedPublication, {
                request: {
                    publicationId: pub.id,
                    cursor
                }
            }).toPromise()
            cursor = response.data.whoCollectedPublication.pageInfo.next
            entries.push(...response.data.whoCollectedPublication.items)
        }
        return entries.filter(x => x.defaultProfile !== null)
    }

    draw = () => {
        const entries = ethers.utils.shuffled(this.state.entries)
        const random = Math.random() * (0 - entries.length) + entries.length
        const index = Math.floor(random)
        this.setState({ winner: entries[index].defaultProfile })
    }

    handleAmountChange = (e) => {
        this.setState( { amount: e.target.value })
        this.validate(e.target.value, this.state.balance)
    }

    handleSend = async () => {
        await send(this.state.winner.ownedBy, this.state.amount, this.state.selectedCurrency)
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
                        <Input position='initial' isInvalid={!this.state.valid} type='number' onChange={this.handleAmountChange} />
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
                    this.state.loadingState === 'loaded' && (
                        <div>
                            {
                                this.state.entries.length > 0 && !this.state.winner && (
                                    <div className="flex my-4">
                                        <FormControl>
                                            <FormLabel>Collectors</FormLabel>
                                            <div className="py-1 bg-white border border-gray-500 rounded-md dark:bg-gray-900">
                                                <DataTable
                                                    columns={columns}
                                                    data={this.state.entries}
                                                    pagination
                                                    paginationComponentOptions={{
                                                        noRowsPerPage: true
                                                    }}
                                                    theme={this.props.theme}
                                                />
                                            </div>
                                        </FormControl>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
                {
                    this.state.loadingState === 'loading' && (
                        <div>
                            <Spinner color="teal" size='lg' />
                        </div>
                    )
                }
                {
                    this.state.loadingState === 'loaded' && this.state.entries.length === 0 && (
                        <div>No collect on this post</div>
                    )
                }
                <div className="flex mt-4 z-10">
                    {
                        this.state.winner ? (
                            <div className="border-2 bg-white w-full dark:bg-gray-900 border-green-600 rounded-xl shadow-md p-4">
                                <div className="flex justify-center md:justify-between md:items-center gap-2">
                                    {
                                        this.state.winner.picture && this.state.winner.picture.original ? (
                                            <div className="flex flex-col items-center md:flex-row text-center justify-center md:justify-between  gap-2">
                                                <Image
                                                    objectFit="cover"
                                                    boxSize="6rem"
                                                    borderRadius='full'
                                                    src={this.state.winner.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                                                />
                                                <div className="flex flex-col">
                                                    <Heading fontSize={'2xl'} fontFamily={'body'}>
                                                        { this.state.winner.name }
                                                    </Heading>
                                                    <Text fontWeight={600} color={'gray.500'} size="sm">
                                                        @{ this.state.winner.handle }
                                                    </Text>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center md:flex-row text-center justify-center md:justify-between  gap-2">
                                                <Box
                                                    boxSize="6rem"
                                                    borderRadius='full'
                                                    bg='gray.400'
                                                />
                                                <div className="flex flex-col">
                                                    <Heading fontSize={'2xl'} fontFamily={'body'}>
                                                        { this.state.winner.name }
                                                    </Heading>
                                                    <Text fontWeight={600} color={'gray.500'} size="sm">
                                                        @{ this.state.winner.handle }
                                                    </Text>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className="hidden md:block">
                                        <Button
                                            colorScheme='teal'
                                            disabled={!this.state.valid}
                                            w={{ base: 'full', sm: 'auto' }}
                                            onClick={this.handleSend}
                                        >Giveaway</Button>
                                    </div>
                                </div>
                                <div className='md:hidden'>
                                    <Button
                                        colorScheme='teal'
                                        disabled={!this.state.valid}
                                        w='full'
                                        mt={2}
                                        onClick={this.handleSend}
                                    >Giveaway</Button>
                                </div>
                            </div>
                        ) : (
                            <Button
                                colorScheme='teal'
                                w={{ base: 'full', sm: 'auto' }}
                                mt={2}
                                onClick={this.draw}
                                disabled={this.state.entries.length === 0 || this.state.loadingState === 'loading'}
                            >
                                Draw
                            </Button>
                        )
                    }
                </div>
            </div>
        )
    }
}
