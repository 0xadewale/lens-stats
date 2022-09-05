import Tabs from '../components/Explore/Tabs'
import { createClient, explorePublications } from '../api'
import { useEffect, useState } from 'react'

export default function Explore() {

  const [tabs, setTabs] = useState({ comments: [], collects: [], mirrors: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
    alert('fetch')
  },[])


  let getTopPublications = async (sortCriteria) => {
    const client = await createClient()
    const topCommented = await client.query(explorePublications, {
      request: {
        sortCriteria,
        publicationTypes: ['POST'],
        limit: 40
      }
    }).toPromise()
    return topCommented.data.explorePublications.items
  }

  let fetchData = async () => {
    setLoading(true)
    let comments = []
    let collects = []
    let mirrors = []
    await getTopPublications("TOP_COMMENTED").then((response) => {
      comments = response
      console.log(response)
    })
    await getTopPublications("TOP_COLLECTED").then((response) => {
      collects = response
    })
    await getTopPublications("TOP_MIRRORED").then((response) => {
      mirrors = response
    })
    setTabs({ comments , collects, mirrors })
    setLoading(false)
  }


    return (
        <div className="container mx-auto">
          <div className="flex justify-center">
            <Tabs tabs={tabs} loading={loading} />
          </div>
        </div>
    )
}
