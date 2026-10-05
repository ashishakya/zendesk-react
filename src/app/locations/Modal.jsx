import { useEffect, useState } from 'react'
import { useClient } from '../hooks/useClient'


const Modal = () => {

  const client = useClient()
  const [comments, setComments] = useState(null)

  const params = new URLSearchParams(window.location.search)

  const ticket = {
    id: params.get('id'),
    subject: params.get('subject'),
    status: params.get('status'),
  }


  const handleModalClose = () => {
    client.invoke("destroy")
  }

  const fetchComments = async () => {
    const response = await client.request({
      url: `/api/v2/tickets/${ticket.id}/comments.json`,
      type: 'GET'
    })

    return response.comments;
  }

  useEffect(() => {
    const loadComments = async () => {
      try {
        const comments = await fetchComments();
        setComments(comments)
      } catch (error) {
        console.log('error>>>>>>', error)
      }
    }

    loadComments()
  }, [client])


  return (
    <div>
      <p>id: {ticket.id}</p>
      <p>subject: {ticket.subject}</p>
      <p>status: {ticket.status}</p>

      <button
        disabled={ticket.id === null}
        onClick={handleModalClose}
      >
        Close
      </button>

      <hr />

      {
        comments === null ? (
          <p>Loading....</p>
        ) :
          comments.length
            ?
            comments.map((comment) => (
              <div key={comment.id}>
                <p>id: {comment.id}</p>
                <p>body: {comment.body}</p>
                <p>{comment.public ? 'Public reply' : 'Internal note'}</p>
                <hr />
              </div>
            ))
            :
            (
              <p>No Comments</p>
            )
      }
    </div>
  )
}

export default Modal
