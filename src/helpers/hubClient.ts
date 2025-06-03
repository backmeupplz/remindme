import { getInsecureHubRpcClient } from '@farcaster/hub-nodejs'

const HUB_URL = '34.172.154.21:3383'
const hubClient = getInsecureHubRpcClient(HUB_URL)

export default hubClient
