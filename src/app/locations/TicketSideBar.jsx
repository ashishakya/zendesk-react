import { useEffect, useState } from 'react'
import { useClient } from '../hooks/useClient'
import { useI18n } from '../hooks/useI18n'
import { Button } from '@zendeskgarden/react-buttons'
import { LG } from '@zendeskgarden/react-typography'
import styled from 'styled-components'

const TicketSideBar = () => {
  const client = useClient()
  const { t } = useI18n()
  const [ticket, setTicket] = useState(null)

  const handleNewInstance = () => {
    const params = new URLSearchParams({
      id: ticket.id,
      subject: ticket.subject,
      status: ticket.status,
    })

    client.invoke('instances.create', {
      location: 'modal',
      url: `${import.meta.env.VITE_ZENDESK_LOCATION}?${params.toString()}`,
      size: {
        width: '650px',
        height: '400px'
      }
    })
  }

  useEffect(() => {
    client.invoke('resize', { width: '100%', height: '640px' })

    const onSubjectChanged = (subject) => {
      setTicket((current) => (current ? { ...current, subject } : current))
    }
    const onStatusChanged = (status) => {
      setTicket((current) => (current ? { ...current, status } : current))
    }
    const onPriorityChanged = (priority) => {
      setTicket((current) => (current ? { ...current, priority } : current))
    }

    client.on('ticket.subject.changed', onSubjectChanged)
    client.on('ticket.status.changed', onStatusChanged)
    client.on('ticket.priority.changed', onPriorityChanged)

    client.get([
      "ticket.id",
      "ticket.subject",
      "ticket.description",
      "ticket.status",
      "ticket.requester.name",
      "ticket.priority",
      "ticket.assignee.user.name",
    ]).then((data) => {
      const ticketData = {
        id: data['ticket.id'],
        subject: data['ticket.subject'],
        description: data['ticket.description'],
        status: data['ticket.status'],
        requester: data['ticket.requester.name'],
        priority: data['ticket.priority'],
        assignee: data['ticket.assignee.user.name'] ?? "Unassigned"
      }
      setTicket(ticketData)
    })

    return () => {
      client.off('ticket.subject.changed', onSubjectChanged)
      client.off('ticket.status.changed', onStatusChanged)
      client.off('ticket.priority.changed', onPriorityChanged)
    }

  }, [client])

  const handleSetToPending = async () => {
    try {
      await client.set("ticket.status", "pending")
    } catch (error) {
      console.error(error)
    }
  }

  const handleSetToOpen = async () => {
    try {
      await client.set('ticket.status', 'open')
    } catch (error) {
      console.error(error)
    }
  }

  const handleTagClick = async () => {
    try {
      const tagToBeAdded = "app_follow_up"
      const response = await client.get('ticket.tags')
      const tags = response["ticket.tags"]

      if (tags.includes(tagToBeAdded)) {
        return
      }

      await client.set('ticket.tags', [...tags, tagToBeAdded])
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddInternalNote = async () => {
    try {
      await client.set('comment.type', 'internalNote')
      await client.set('comment.text', 'Checked from the Ticket Assistant app.')
    } catch (error) {
      console.error(error)
    }
  }

  const handlePriorityChange = async (priority) => {
    try {
      await client.set('ticket.priority', priority)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Panel>
      <LG isBold>{t('ticket_sidebar.title')}</LG>
      {!ticket ? (
        <span>Loading...</span>
      ) : (
        <Details>
          <Detail>
            <Label>Ticket Id</Label>
            <Value>{ticket.id}</Value>
          </Detail>
          <Detail>
            <Label>Subject</Label>
            <Value>{ticket.subject}</Value>
          </Detail>
          <Detail>
            <Label>Description</Label>
            <Description>{ticket.description}</Description>
          </Detail>
          <Detail>
            <Label>Status</Label>
            <Value>{ticket.status}</Value>
          </Detail>
          <Detail>
            <Label>Requester</Label>
            <Value>{ticket.requester}</Value>
          </Detail>
          <Detail>
            <Label>Priority</Label>
            <Value>{ticket.priority}</Value>
          </Detail>
          <Detail>
            <Label>Assignee</Label>
            <Value>{ticket.assignee}</Value>
          </Detail>
        </Details>
      )}
      <Actions>
        <Button isBasic onClick={handleNewInstance} disabled={!ticket}>
          Open Modal Instance
        </Button>
        <Button isPrimary onClick={handleSetToPending} disabled={!ticket}>
          Set to Pending
        </Button>
        <Button isPrimary onClick={handleSetToOpen} disabled={!ticket}>
          Set to Open
        </Button>
        <Button isBasic onClick={handleTagClick} disabled={!ticket}>
          Add tag
        </Button>
        <Button isBasic onClick={handleAddInternalNote} disabled={!ticket}>
          Add Internal Note
        </Button>
        <Button onClick={() => handlePriorityChange('low')} disabled={!ticket}>Low</Button>
        <Button onClick={() => handlePriorityChange('normal')} disabled={!ticket}>Normal</Button>
        <Button onClick={() => handlePriorityChange('high')} disabled={!ticket}>High</Button>
        <Button onClick={() => handlePriorityChange('urgent')} disabled={!ticket}>Urgent</Button>
      </Actions>
    </Panel>
  )
}

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.space.md};
  padding: ${(props) => props.theme.space.sm};
`

const Details = styled.dl`
  display: grid;
  gap: ${(props) => props.theme.space.xs};
  margin: 0;
`

const Detail = styled.div`
  display: grid;
  gap: 2px;
`

const Label = styled.dt`
  margin: 0;
  font-size: ${(props) => props.theme.fontSizes.sm};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  color: ${(props) => props.theme.palette.grey[600]};
`

const Value = styled.dd`
  margin: 0;
  word-break: break-word;
`

const Description = styled(Value)`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.space.xs};

  button {
    justify-content: center;
    width: 100%;
  }
`

export default TicketSideBar
