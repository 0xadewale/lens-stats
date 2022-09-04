import {useState, Fragment, Component} from 'react'
import {RadioGroup} from '@headlessui/react'
import { Badge, Box, Button, Center, FormControl, FormLabel, Image, Text } from "@chakra-ui/react";
import {Dialog, Transition} from "@headlessui/react";
import { XIcon, CheckCircleIcon } from '@heroicons/react/solid'
import {AddIcon} from "@chakra-ui/icons";

export default class PostSelector extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false
        }
    }

    closeModal = () => {
        this.setState({ isOpen: false })
    }

    openModal = () => {
        this.setState({ isOpen: true })
    }

    handleSelect = (item) => {
        this.setState({ isOpen: false })
        this.props.onSelect(item)
    }

    render () {
        return (
            <div className="w-full">
                <FormControl>
                    <FormLabel>Post</FormLabel>
                    {this.props.selected ? (
                        <div className="rounded-md p-2 cursor-pointer border border-gray-500" onClick={this.openModal}>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2 my-2">
                                    <div className="avatar">
                                        {
                                            this.props.profile.picture && this.props.profile.picture.original ? (
                                                <Image
                                                    src={this.props.profile.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
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
                                    <div className="font-semibold text-md">
                                        { this.props.profile.name }
                                    </div>
                                </div>
                                <div>
                                    {
                                        this.props.selected.metadata.content ? (
                                            <div className="w-3/4">
                                                <Text>
                                                    {this.props.selected.metadata.content}
                                                </Text>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col w-full">
                                                <Image
                                                    src={this.props.selected.metadata.media[0]?.original.url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
                                                    alt="post image metadata"
                                                    fallbackSrc="https://via.placeholder.com/150"
                                                    objectFit="cover"
                                                    w={'10rem'}
                                                    borderRadius='md'
                                                />
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Button variant="Ghost" onClick={this.openModal}>
                            <AddIcon />
                        </Button>
                    )
                    }
                    <Transition appear show={this.state.isOpen} as={Fragment}>
                        <Dialog as="div" className="relative z-30" onClose={this.closeModal}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black bg-opacity-25"/>
                            </Transition.Child>

                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4 text-center">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Dialog.Panel
                                            className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                            <Dialog.Title as="div" className="flex justify-between items-center">
                                                <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                                                    Select Post
                                                </h3>
                                                <div>
                                                    <Button variant='ghost' onClick={this.closeModal}>
                                                        <XIcon className="h-6" />
                                                    </Button>
                                                </div>
                                            </Dialog.Title>
                                            <div className="w-full mt-4 h-[40rem] overflow-y-scroll scrollbar-hide">
                                                <div className="mx-auto mr-2">
                                                    <RadioGroup value={this.props.selected} onChange={this.handleSelect} name="module">
                                                        <div className="space-y-2">
                                                            {this.props.posts.map((post) => (
                                                                <RadioGroup.Option
                                                                    key={post.id}
                                                                    value={post}
                                                                    className={({active, checked}) =>
                                                                        `${
                                                                            active
                                                                                ? ''
                                                                                : ''
                                                                        }
                      ${
                                                                            checked ? 'text-gray-900' : 'bg-white dark:bg-gray-800'
                                                                        } relative flex cursor-pointer rounded-lg px-5 py-4 border border-gray-500 focus:outline-none`
                                                                    }
                                                                >
                                                                    {({active, checked}) => (
                                                                        <>
                                                                            <div
                                                                                className="flex w-full items-center justify-between">
                                                                                <div className="flex items-center">
                                                                                    <div className="text-sm">
                                                                                        <RadioGroup.Label
                                                                                            as="p"
                                                                                            className={`font-semibold  ${
                                                                                                checked ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'
                                                                                            }`}
                                                                                        >
                                                                                            {
                                                                                                post.metadata.content ? (
                                                                                                    <div className="w-3/4">
                                                                                                        <Text noOfLines={2}>
                                                                                                            {post.metadata.content}
                                                                                                        </Text>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <div className="flex flex-col w-full">
                                                                                                        <Image
                                                                                                            src={post.metadata.media[0]?.original.url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
                                                                                                            alt="post image metadata"
                                                                                                            fallbackSrc="https://via.placeholder.com/150"
                                                                                                            objectFit="cover"
                                                                                                            w={'10rem'}
                                                                                                            borderRadius='md'
                                                                                                        />
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                        </RadioGroup.Label>
                                                                                        <RadioGroup.Description
                                                                                            as="span"
                                                                                            className='inline text-gray-500'
                                                                                        >
                                                                                            <span>{post.description}</span>
                                                                                        </RadioGroup.Description>
                                                                                    </div>
                                                                                </div>
                                                                                {checked && (
                                                                                    <div className="shrink-0 text-teal-500">
                                                                                        <CheckCircleIcon className="h-6 w-6"/>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </RadioGroup.Option>
                                                            ))}
                                                        </div>
                                                    </RadioGroup>
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                </FormControl>
            </div>
        )
    }
}
