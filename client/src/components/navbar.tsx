import keycloak from "../keycloak/keycloak";

async function logOut(token: string) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await fetch("http://localhost:9000/logout", options);
    const data = await response.json();
    return data;
}

const Navbar = () => {
    const handleLogout = () => {
        keycloak.logout();
        logOut(keycloak.token).then((res) => console.log(res));
        localStorage.removeItem("token");
        localStorage.removeItem("secretKey");
        localStorage.removeItem("publicKey");
    };

    return (
        <div className="flex flex-row gap-x-2 p-1 items-center bg-blue-500 h-[50px] text-white font-medium justify-end px-2">
            <div>{keycloak?.idTokenParsed?.preferred_username}</div>
            <button onClick={handleLogout}>logout</button>
        </div>
    );
};

export default Navbar;
