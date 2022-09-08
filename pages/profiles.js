import { useState, useEffect } from 'react'
import { createClient, searchProfiles } from '../api'
import { useRouter } from 'next/router'
import { UserCard } from "../components/UserCard";
import {Placeholders} from "../components/Placeholders";
import {Center} from "@chakra-ui/react";
import Head from 'next/head'
import Seo from '../components/utils/Seo'
import { APP_NAME } from '../constants'

export default function Home() {
  const router = useRouter()
  const { search } = router.query
  const [profiles, setProfiles] = useState([])
  const [loadingState, setLoadingState] = useState('loading')

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
      setProfiles(profileData)
      setLoadingState('loaded')
    } catch (err) {
      console.log('error searching profiles...', err)
    }
  }

  return (
    <div>
      <Seo
          title={`Profiles | ${APP_NAME}`}
      />
      {
         loadingState === 'loading' && <Placeholders number={4} />
      }
      {
        !profiles.length && (
              <Center>No Results</Center>
          )
      }
      {
        profiles.map((profile, index) => (
            <UserCard key={index} user={profile} />
        ))
      }
    </div>
  )
}
