import keycloak from "../keycloak/keycloak"

const Navbar = () => {
    const handleLogout = () => {
        localStorage.removeItem('token')
        keycloak.logout()
    }

    return (
        <div className='flex flex-row gap-x-2 p-1 items-center bg-blue-500 h-[50px] text-white font-medium justify-end px-2'>
            <div>{keycloak?.idTokenParsed?.preferred_username}</div>
            <button onClick={handleLogout}>logout</button>
        </div>
    )
}

export default Navbar