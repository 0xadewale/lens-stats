import {Component, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

export default class Select extends Component {
  constructor(props) {
    super(props);
  }

  handleSelect = (item) => {
    this.props.onSelect(item)
  }

  render() {
    return (
        <div className="w-full">
          <Listbox value={this.props.selected} onChange={this.handleSelect}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                {
                  this.props.selected ? (
                        <span className="block truncate">{this.props.selected.name}</span>
                    ) : (
                      <span className="block truncate text-gray-400">Choose a currency</span>
                  )
                }
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
              />
            </span>
              </Listbox.Button>
              <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {this.props.list.map((person, personIdx) => (
                      <Listbox.Option
                          key={personIdx}
                          className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                  active ? 'bg-teal-100 dark:bg-teal-800 text-teal-900 dark:text-teal-200' : 'text-gray-900 dark:text-white'
                              }`
                          }
                          value={person}
                      >
                        {({ selected }) => (
                            <>
                      <span
                          className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                          }`}
                      >
                        {person.name}
                      </span>
                              {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                              ) : null}
                            </>
                        )}
                      </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
    )
  }
}
