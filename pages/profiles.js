import { useState, useEffect } from 'react'
import { createClient, searchProfiles, recommendProfiles, getPublications } from '../api'
import { css } from '@emotion/css'
import { trimString, generateRandomColor } from '../utils'
import { Button, SearchInput, Placeholders } from '../components'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const { search } = router.query
  const [profiles, setProfiles] = useState([])
  const [loadingState, setLoadingState] = useState('loading')
  const [searchString, setSearchString] = useState('')

  useEffect(() => {
    if (search) {
      searchForProfile()
    }
  },[search])

  async function searchForProfile() {
    try {
      const urqlClient = await createClient()
      const response = await urqlClient.query(searchProfiles, {
        query: search, type: 'PROFILE'
      }).toPromise()
      const profileData = await Promise.all(response.data.search.items)
      console.log(profileData)
      setProfiles(profileData)
      setLoadingState('loaded')
    } catch (err) {
      console.log('error searching profiles...', err)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      searchForProfile()
    }
  }

  return (
    <div>
      <div className={listItemContainerStyle}>
        {
           loadingState === 'loading' && <Placeholders number={6} />
        }
        {
          profiles.map((profile, index) => (
            <Link href={`/profile/${profile.profileId}`} key={index}>
              <a>
                <div className={listItemStyle}>
                  <div className={profileContainerStyle} >
                    {
                      profile.picture && profile.picture.original ? (
                      <img
                        src={profile.picture.original.url}
                        className={profileImageStyle}
                        width="42px"
                        height="42px"
                      />
                      ) : (
                        <div
                          className={
                            css`
                            ${placeholderStyle};
                            background-color: ${profile.backgroundColor};
                            `
                          }
                        />
                      )
                    }

                    <div className={profileInfoStyle}>
                      <h3 className={nameStyle}>{profile.name}</h3>
                      <p className={handleStyle}>{profile.handle}</p>
                    </div>
                  </div>
                  <div>
                    <p className={latestPostStyle}>{trimString(profile.publication?.metadata.content, 200)}</p>
                  </div>
                </div>
              </a>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

const searchContainerStyle = css`
  padding: 40px 0px 30px;
`

const latestPostStyle = css`
  margin: 23px 0px 5px;
  word-wrap: break-word;
`

const profileContainerStyle = css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`

const profileImageStyle = css`
  border-radius: 21px;
  width: 42px;
  height: 42px;
`

const placeholderStyle = css`
  ${profileImageStyle};
`

const listItemContainerStyle = css`
  display: flex;
  flex-direction: column;
`

const listItemStyle = css`
  background-color: white;
  margin-top: 13px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, .15);
  padding: 21px;
`

const profileInfoStyle = css`
  margin-left: 10px;
`

const nameStyle = css`
  margin: 0 0px 5px;
`

const handleStyle = css`
  margin: 0px 0px 5px;
  color: #b900c9;
`

const inputStyle = css`
  outline: none;
  border: none;
  padding: 15px 20px;
  font-size: 16px;
  border-radius: 25px;
  border: 2px solid rgba(0, 0, 0, .04);
  transition: all .4s;
  width: 300px;
  background-color: #fafafa;
  &:focus {
    background-color: white;
    border: 2px solid rgba(0, 0, 0, .1);
  }
`
