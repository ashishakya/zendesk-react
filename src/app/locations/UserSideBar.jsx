import { useEffect, useState } from 'react'
import { useClient } from '../hooks/useClient'

const UserSideBar = () => {
    const [customer, setCustomer] = useState(null)
    const client = useClient()


    useEffect(() => {
        client.get([
            'user.name',
            "user.email"
        ]).then((data) => {
            const customer = {
                name: data['user.name'],
                email: data['user.email']
            }

            setCustomer(customer)
        })
    }, [client])

    return (
        customer ? (
            <div>
                <div>Name: {customer.name}</div>
                <div>Email: {customer.email}</div>
            </div>
        ) : (
            <span>Loading...</span>
        )
    )   
}

export default UserSideBar
