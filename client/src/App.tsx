import { useEffect, useState } from "react";
import InputValueComponent from "./components/inputValue.component";
import Navbar from "./components/navbar";
import keycloak from "./keycloak/keycloak";
import {
    generateKey,
    encryptLocal,
    encryptRSA,
} from "@marcon2n/nexusti/src/index";

import "./App.css";

async function getKey(token: string) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await fetch("http://192.168.0.123:8000/key", options);
    const key = await response.text();
    return key;
}

function postKey(key: string, token: string) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: key,
    };
    fetch("http://192.168.0.123:8000/key", options);
}

function App() {
    const [auth, setAuth] = useState<boolean>(false);

    if (!auth) {
        keycloak.init({ onLoad: "login-required" }).then((auth: boolean) => {
            if (auth) {
                setAuth(true);
            }
        });
    }

    useEffect(() => {
        if (!auth || !keycloak.token) return;
        const tokenData = keycloak.token;
        getKey(tokenData)
            .then((res) => {
                // Tạo secret-key để tiến hành mã hóa AES
                const secretKey = generateKey();

                // Mã hóa key và lưu thông tin vào local
                const encryptSecretKey = encryptLocal(secretKey);
                localStorage.setItem("secretKey", encryptSecretKey);

                // Mã hóa key theo RSA với publicKey từ server gửi về
                encryptRSA(secretKey, res).then((encryptKey: string) => {
                    postKey(encryptKey, tokenData);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }, [auth]);

    return (
        <>
            {auth ? (
                <div className="flex flex-col w-full">
                    <Navbar />
                    <div className="flex grow">
                        <InputValueComponent />
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default App;
