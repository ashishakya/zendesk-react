import { useState, useEffect } from 'react'
import { useClient } from '../hooks/useClient'
export default function NavBar() {
    const [tickets, setTickets] = useState(null)
    const client = useClient()

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await client.request({
                    url: '/api/v2/tickets.json?sort_by=updated_at&sort_order=desc&per_page=5',
                    type: 'GET'
                })
                setTickets(response.tickets)
            } catch (error) {
                console.error(error)
                setTickets('Could not load tickets.')
            }
        }
        fetchTickets()
    }, [client])

    const handleTicketClick = (ticketId) => {
        client.invoke("routeTo", "ticket", ticketId)
    }

    if (!tickets) {
        return <span>Loading...</span>
    }

    if (typeof tickets === 'string') {
        return <span>{tickets}</span>
    }

    if (tickets.length === 0) {
        return <span>No tickets</span>
    }
    return (
        tickets.map((ticket) => (
            <div key={ticket.id} onClick={() => handleTicketClick(ticket.id)}>
                id: {ticket.id} <br />
                Subject:{ticket.subject}<br />
                Status:{ticket.status}<br />
                <hr />
            </div>
        ))
    )
}