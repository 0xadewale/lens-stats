import { useState } from 'react'
import { Tab } from '@headlessui/react'
import Post from '../ui/Post'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Tabs({ tabs, loading }) {

  return (
      <div className="w-full max-w-6xl px-2 sm:px-0">
        {
          loading ? (
              <div>
                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 dark:bg-gray-800 p-1">
                    <Tab className='w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-600 shadow'>
                      <span>Top Commented</span>
                    </Tab>
                    <Tab className='w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-800 dark:text-gray-100 text-teal-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800'>
                      Top Collected
                    </Tab>
                    <Tab className='w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-800 dark:text-gray-100 text-teal-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800'>
                      Top Mirrored
                    </Tab>
                  </Tab.List>
                  <Tab.Panels className="mt-2">
                    <Tab.Panel>
                      <div>Loading</div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
          ) : (
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 dark:bg-gray-800 p-1">
                  {Object.keys(tabs).map((category) => (
                      <Tab
                          key={category}
                          className={({ selected }) =>
                              classNames(
                                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-800 dark:text-gray-100',
                                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-teal-400 focus:outline-none focus:ring-2',
                                  selected
                                      ? 'bg-white dark:bg-gray-600 shadow'
                                      : 'text-teal-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800'
                              )
                          }
                      >
                        {
                            category === 'comments' && (
                                <span>Top Commented</span>
                            )
                        }
                        {
                            category === 'collects' && (
                                <span>Top Collected</span>
                            )
                        }
                        {
                            category === 'mirrors' && (
                                <span>Top Mirrored</span>
                            )
                        }
                      </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="mt-2">
                  {Object.values(tabs).map((posts, idx) => (
                      <Tab.Panel key={idx} className="px-3 focus:outline-none">
                        <div className="rounded-md border border-gray-500">
                          {posts.map((post, index) => (
                              <Post post={post} key={index} />
                          ))}
                        </div>
                      </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
          )
        }
      </div>
  )
}
