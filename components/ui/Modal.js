import {useState, Fragment, Component} from 'react'
import {RadioGroup} from '@headlessui/react'
import {Badge, Button} from "@chakra-ui/react";
import {Dialog, Transition} from "@headlessui/react";
import { XIcon, CheckCircleIcon } from '@heroicons/react/solid'
import {AddIcon} from "@chakra-ui/icons";

export default class Modal extends Component {
  constructor(props) {
    super(props)
  }

  render () {
    return (
        <>
          <Transition appear show={this.props.isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={this.props.onClose}>
              <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                          as="div"
                          className="flex justify-between items-center text-lg font-medium leading-6 text-gray-900"
                      >
                        <h3 className="dark:text-white">{this.props.title}</h3>
                        <div>
                          <Button variant='ghost' onClick={this.props.onClose}>
                            <XIcon className="h-6" />
                          </Button>
                        </div>
                      </Dialog.Title>
                      <div className="mt-2">
                        {this.props.children}
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </>
    )
  }
}
