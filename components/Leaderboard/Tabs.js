import { Tab } from '@headlessui/react'
import { Box, Image, Show, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faMedal } from '@fortawesome/free-solid-svg-icons'

export default function Tabs({ tabs, loading }) {
  const router = useRouter()

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  let redirect = async (profile) => {
    await router.push(`/profile/${profile.handle}`)
  }
  return (
      <div className="w-full max-w-6xl px-2 sm:px-0">
        {
          loading ? (
              <div>
                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 dark:bg-gray-800 p-1">
                    <Tab className='w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-800 dark:text-gray-100 text-teal-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800'>
                      Followers
                    </Tab>
                    <Tab className='w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-600 shadow'>
                      <span>Post</span>
                    </Tab>
                    <Tab className='w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-800 dark:text-gray-100 text-teal-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800'>
                      Collects
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
                            category === 'followers' && (
                                <span>Followers</span>
                            )
                        }
                        {
                            category === 'posts' && (
                                <span>Posts</span>
                            )
                        }
                        {
                            category === 'collects' && (
                                <span>Collects</span>
                            )
                        }
                      </Tab>
                  ))}
                </Tab.List>
                {Object.values(tabs).map((profiles, idx) => (
                    <Tab.Panel key={idx} className="focus:outline-none mt-2">
                      <TableContainer>
                        <Table variant='simple'>
                          <Thead>
                            <Tr>
                              <Th>Profile</Th>
                              <Th>Followers</Th>
                              <Show above='md'>
                                <Th>Posts</Th>
                                <Th>Collects</Th>
                                <Th isNumeric>Links</Th>
                              </Show>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {profiles.map((profile, index) => (
                                <Tr key={index} className='hover:bg-gray-100 dark:hover:bg-gray-800 relative'>
                                  <Td className='px-2'>
                                    <div className="flex flex-col lg:flex-row gap-2 lg:items-center">
                                      <div>
                                        {
                                          profile.picture && profile.picture.original ? (
                                              <Image
                                                  src={profile.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
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
                                      <div className='font-semibold break-words'>
                                        { profile.name || profile.handle }
                                      </div>
                                    </div>
                                    {
                                      index === 0 && (
                                          <FontAwesomeIcon
                                              className='absolute top-1 left-4 w-6 h-6 text text-center pt-0.5 text-yellow-300 dark:text-yellow-400'
                                              icon={faCrown}
                                          />
                                      )
                                    }
                                    {
                                        index === 1 && (
                                            <FontAwesomeIcon
                                                className='absolute top-1 left-4 w-6 h-6 text text-center pt-0.5 text-gray-500 dark:text-gray-400'
                                                icon={faMedal}
                                            />
                                        )
                                    }
                                    {
                                        index === 2 && (
                                            <FontAwesomeIcon
                                                className='absolute top-1 left-4 w-6 h-6 text text-center pt-0.5 text-orange-400 dark:text-orange-500'
                                                icon={faMedal}
                                            />
                                        )
                                    }
                                  </Td>
                                  <Td>{ profile.stats.totalFollowers }</Td>
                                  <Show above='md'>
                                    <Td>{ profile.stats.totalPosts }</Td>
                                    <Td>{ profile.stats.totalCollects }</Td>
                                    <Td isNumeric>
                                      <div className='flex justify-end items-center gap-3'>
                                        <a href={`https://lenster.xyz/u/${profile.handle}`} target='_blank' rel="noreferrer">
                                          <Image
                                              src='assets/logo-lenster.svg'
                                              alt='Lenster logo'
                                              boxSize={'1.5rem'}
                                          />
                                        </a>
                                        <a href={`https://polygonscan.com/address/${profile.ownedBy}`} target='_blank' rel="noreferrer">
                                          <Image
                                              src='assets/logo-polygon.svg'
                                              alt='Polygonscan logo'
                                              boxSize={'1.5rem'}
                                          />
                                        </a>
                                      </div>
                                    </Td>
                                  </Show>
                                </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Tab.Panel>
                ))}
              </Tab.Group>
          )
        }
      </div>
  )
}
