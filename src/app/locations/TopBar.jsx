import { useEffect, useState } from 'react'
import { useClient } from '../hooks/useClient'

const TopBar = () => {
    const [name, setName] = useState(null)
    const [title, setTitle] = useState(null)
    const client = useClient()


    useEffect(() => {
        client.get('currentUser.name').then((data) => {
            setName(data['currentUser.name'])
        })


        const loadSampleTask = async () => {
            try {
                const response = await client.request({
                    url: 'https://jsonplaceholder.typicode.com/todos/1',
                    type: 'GET'
                })
                setTitle(response.title)
            } catch (error) {
                console.error(error)
                setTitle('Could not load the sample task.')
            }
        }

        loadSampleTask()

    }, [client])

    return (
        <div>
            {
                name ? (
                    <div>Current User: {name}</div>
                ) : (
                    <span>Loading...</span>
                )
            }
            <br />
            {
                title ? (
                    <div>Sample Task: {title}</div>
                ) : (
                    <span>Loading...</span>
                )
            }
        </div>
    )
}

export default TopBar
