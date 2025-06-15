import MeetingList from "@/components/MeetingList"
import { getAllMeetings } from "@/lib/meetings"

export default async function MeetingsPage() {
  const meetings = await getAllMeetings()

  return (
    <div>
      <h1>Meetings</h1>
      <MeetingList meetings={meetings} />
    </div>
  )
}
