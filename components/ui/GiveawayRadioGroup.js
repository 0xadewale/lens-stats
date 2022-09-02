import {useState, Fragment, Component} from 'react'
import {RadioGroup} from '@headlessui/react'
import {Badge, Button} from "@chakra-ui/react";
import {Dialog, Transition} from "@headlessui/react";
import { XIcon, CheckCircleIcon } from '@heroicons/react/solid'

const plans = [
    {
        name: 'Best Collector',
        desription: ''
    },
    {
        name: 'Best Commentary',
        description: ''
    },
    {
        name: 'x Followers',
        description: ''
    },
    {
        name: 'x Collectors',
        description: ''
    },
    {
        name: 'x Commentary',
        description: ''
    }
]

export default class GiveawayRadioGroup extends Component {
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
        this.props.onSelect(item)
    }

    render () {
        return (
            <div>
                {this.props.selected ? (
                    <Badge
                        p={2}
                        borderRadius="md"
                        colorScheme='teal'
                        onClick={this.openModal}
                        className='cursor-pointer'
                    >{this.props.selected.name}</Badge>
                ) : (
                    <Button variant="Ghost" onClick={this.openModal}>
                        Plus
                    </Button>
                )
                }
                <Transition appear show={this.state.isOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-10" onClose={this.closeModal}>
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
                                                Select giveaway module
                                            </h3>
                                            <div>
                                                <Button variant='ghost' onClick={this.closeModal}>
                                                    <XIcon className="h-6" />
                                                </Button>
                                            </div>
                                        </Dialog.Title>
                                        <div className="w-full mt-4">
                                            <div className="mx-auto w-full max-w-md">
                                                <RadioGroup value={this.props.selected} onChange={this.handleSelect} name="module">
                                                    <div className="space-y-2">
                                                        {plans.map((plan) => (
                                                            <RadioGroup.Option
                                                                key={plan.name}
                                                                value={plan}
                                                                className={({active, checked}) =>
                                                                    `${
                                                                        active
                                                                            ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-teal-300'
                                                                            : ''
                                                                    }
                  ${
                                                                        checked ? 'bg-teal-700 bg-opacity-75 text-white' : 'bg-white dark:bg-gray-800'
                                                                    } relative flex cursor-pointer rounded-lg px-5 py-4 border border-gray-300 focus:outline-none`
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
                                                                                        className={`font-medium  ${
                                                                                            checked ? 'text-white' : 'text-gray-900 dark:text-white'
                                                                                        }`}
                                                                                    >
                                                                                        {plan.name}
                                                                                    </RadioGroup.Label>
                                                                                    <RadioGroup.Description
                                                                                        as="span"
                                                                                        className={`inline ${
                                                                                            checked ? 'text-sky-100' : 'text-gray-500'
                                                                                        }`}
                                                                                    >
                                                                                        <span>{plan.description}</span>
                                                                                    </RadioGroup.Description>
                                                                                </div>
                                                                            </div>
                                                                            {checked && (
                                                                                <div className="shrink-0 text-white">
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
            </div>
        )
    }
}
