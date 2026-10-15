import { useEffect, useState } from "react"
import { useClient } from "../hooks/useClient"
const OrganizationSideBar = () => {
    const client = useClient()
    const [organisation, setOrganisation] = useState(null)
    const [users, setUsers] = useState(null)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await client.get(['organization.id', 'organization.name'])
                const org = {
                    id: data['organization.id'],
                    name: data['organization.name']
                }
                setOrganisation(org)

                const response = await client.request({
                    url: `/api/v2/organizations/${org.id}/users.json`,
                    type: 'GET'
                })
                setUsers(response.users)
            } catch (error) {
                console.error("Could not load organisation details")
                setOrganisation({ name: 'Could not load the organization.' })
                setUsers([])
            }

        }

        load()
    }, [client])

    if (!organisation || !users) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div>
            <h1>{organisation.name}</h1>
            <ul>
                {users.length === 0 ? (
                    <li>No users found</li>
                ) : (
                    users.slice(0, 5).map(user => (
                        <li key={user.id}>{user.name}</li>
                    ))
                )}
            </ul>
        </div>
    )
}

export default OrganizationSideBar
