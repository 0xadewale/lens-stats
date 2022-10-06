import LeaderBoard from '../components/Leaderboard'
import Seo from '../components/utils/Seo'
import { APP_NAME } from '../constants'

export default function index() {
    return (
        <>
          <Seo
              title={`Leaderboard | ${APP_NAME}`}
              description={`Reward your Lens Protocole followers/Collectors by creating a giveaway`}
          />
          <LeaderBoard />
        </>
    )
}
