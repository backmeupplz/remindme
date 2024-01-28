import env from './env'
import neynar from './neynar'

export default async function (text: string, replyTo: string) {
  const cast = await neynar.v2.publishCast(env.NEYNAR_UUID, text, {
    replyTo: replyTo,
  })
  return cast.hash
}
