import { useEffect, useState } from 'react'
import { useClient } from '../hooks/useClient'

const TopBar = () => {
    const [name, setName] = useState(null)
    const client = useClient()


    useEffect(() => {
        client.get('currentUser.name').then((data) => {
            setName(data['currentUser.name'])
        })
    }, [client])

    return (
        name ? (
            <div>Current User: {name}</div>
        ) : (
            <span>Loading...</span>
        )
    )
}

export default TopBar
