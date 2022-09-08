import Giveaway from '../components/Giveaway'
import Seo from '../components/utils/Seo'
import { APP_NAME } from '../constants'

export default function index() {
    return (
        <>
          <Seo
              title={`Giveway | ${APP_NAME}`}
              description={`Reward your Lens Protocole followers/Collectors by creating a giveaway`}
          />
          <Giveaway />
        </>
    )
}
