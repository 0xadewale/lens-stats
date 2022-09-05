import { Box, Image } from '@chakra-ui/react'
import { ChatIcon, ChatAlt2Icon, ChatAltIcon } from '@heroicons/react/solid'

export default function Post({post}) {
  return (
      <div className="border-b-gray-500 border-b p-4 cursor-default">
        <div className="flex gap-2 items-center">
          <div>
            {
              post.profile.picture && post.profile.picture.original ? (
                  <Image
                      src={post.profile.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
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
          <div>
            <div className="font-semibold">{post.profile.name || post.profile.handle}</div>
            <div className="text-gray-500 font-thin">@{post.profile.handle}</div>
          </div>
        </div>
        <div className="px-8 pt-8 font-medium leading-5">
          <div className="text-ellipsis overflow-hidden">
            {post.metadata?.content}
          </div>
          {
              post.metadata?.media.length > 0 && (
                  <div className="flex mt-4">
                    {
                      post.metadata.media[0].original.mimeType.startsWith('video/') && (
                            <video controls className="w-1/2 rounded-md h-80">
                              <source
                                  src={post.metadata.media[0].original?.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                                  type={post.metadata.media[0].original.mimeType}
                              />
                            </video>
                        )
                    }
                    {
                      post.metadata.media[0].original.mimeType.startsWith('image/') && (
                            <img
                                src={post.metadata.media[0].original?.url.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                                alt="post image"
                                className="object-cover w-1/2 rounded-md"
                            />
                        )
                    }
                  </div>
              )
          }
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-1 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <span>{ post.stats.totalAmountOfComments}</span>
            </div>
            <div className="flex items-center gap-1 text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>
              <span>{ post.stats.totalAmountOfMirrors}</span>
            </div>
            <div className="flex items-center gap-1 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
              </svg>
              <span>{ post.stats.totalAmountOfCollects}</span>
            </div>
          </div>
        </div>
      </div>
  )
}
