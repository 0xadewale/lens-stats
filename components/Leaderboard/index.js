import { useEffect, useState } from 'react'
import { createClient, exploreProfiles } from '../../api'
import Tabs from '../Leaderboard/Tabs'

export default function LeaderBoard () {
  const [tabs, setTabs] = useState({ followers: [], collects: [], posts: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  let fetchData = async () => {
    setLoading(true)
    let posts = []
    let followers = []
    let collects = []
    await getLeaderboard("MOST_FOLLOWERS").then((response) => {
      followers = response
    })
    await getLeaderboard("MOST_COLLECTS").then((response) => {
      collects = response
    })
    await getLeaderboard("MOST_POSTS").then((response) => {
      posts = response
    })
    setTabs({ followers, collects, posts })
    setLoading(false)
  }

  let getLeaderboard = async (sortCriteria) => {
    const client = await createClient()
    const response = await client.query(exploreProfiles, {
      sortCriteria
    }).toPromise()
    console.log(response)
    return response.data.exploreProfiles.items
  }

  return (
      <div className="container mx-auto">
        <div className="flex justify-center">
          <Tabs tabs={tabs} loading={loading} />
        </div>
      </div>
  )
}
