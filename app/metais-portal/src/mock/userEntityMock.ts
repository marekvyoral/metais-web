export interface User {
    login: string
    displayName: string
    firstName: string
    lastName: string
    state: string
    position: string
    uuid: string
    name: string
    preferred_username: string
    authenticationResource: string
    email: string
    phone: string
    roles: string[]
    groupData: string[]
}

export const userEntityMock: User = {
    login: '',
    displayName: 'Ing. Jozko Hrasko',
    firstName: 'Jozko',
    lastName: 'Hrasko',
    state: '',
    position: '',
    uuid: '12345',
    name: '',
    preferred_username: 'hasbula',
    authenticationResource: '',
    email: 'jozkoHrasko@123.sk',
    phone: '09123456',
    roles: [],
    groupData: [],
}
