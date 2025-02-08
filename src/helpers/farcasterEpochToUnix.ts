export default function farcasterEpochToUnix(farcasterTimestamp: number): number {
  const farcasterEpoch = new Date("2021-01-01T00:00:00Z").getTime() / 1000; // Convert to seconds
  const realTimestamp = (farcasterTimestamp + farcasterEpoch) * 1000;
  return realTimestamp
}