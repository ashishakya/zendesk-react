import { useEffect, useState } from 'react'
import { useClient } from '../hooks/useClient'

const NewTicketSideBar = () => {

  const [ticket, setTicket] = useState(null)

  const client = useClient()

  useEffect(() => {
    const handleTicketSubjectChanged = (subject) => {
      setTicket((current) => (current ? { ...current, subject } : current))
    }

    client.on("ticket.subject.changed", handleTicketSubjectChanged)

    client.get(["ticket.subject", 'ticket.requester.name'])
      .then(ticket => {
        const ticketDetail = {
          subject: ticket['ticket.subject'],
          requester: ticket['ticket.requester.name'],
        }

        setTicket(ticketDetail)
      })

    return () => {
      client.off("ticket.subject.changed", handleTicketSubjectChanged)
    }
  }, [client])

  if (!ticket) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div>
      <p>Subject: {ticket.subject ? ticket.subject : 'No subject yet'}
      </p> <br />
      <p>Requester: {ticket.requester}</p> <br />
    </div>
  )
}


export default NewTicketSideBar
