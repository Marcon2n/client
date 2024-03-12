import { useState } from "react";
import { data128, data1Mb, data256, data2Mb, data512 } from "../test data/data";
import keycloak from "../keycloak/keycloak";
import { decrypt, decryptLocal, encrypt } from "@marcon2n/nexusti/src/index";

async function postData(encryptData: string, keyCrypto: string) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${keycloak.token}`,
            Encryption: "true",
        },
        body: encryptData,
    };

    const response = await fetch("http://192.168.0.123:8000/message", options);
    const data = await response.text();
    const dataDecrypt = decrypt(data, keyCrypto);
    return dataDecrypt;
}

function InputValueComponent() {
    const [inputValue, setInputValue] = useState("");
    const [cipherTextString, setCipherTextString] = useState<string>("");
    const [serverResponse, setServerResponse] = useState<string>("");
    const [radioSelected, setRadioSelected] = useState<string>("None");
    const [selectedData, setSelectedData] = useState<string>("");

    const handleOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleOnchangeRadio = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRadioSelected(event.target.value);
        switch (event.target.value) {
            case "None":
                setSelectedData("");
                break;
            case "128":
                setSelectedData(JSON.stringify(data128));
                break;
            case "256":
                setSelectedData(JSON.stringify(data256));
                break;
            case "512":
                setSelectedData(JSON.stringify(data512));
                break;
            case "1024":
                setSelectedData(JSON.stringify(data1Mb));
                break;
            case "2048":
                setSelectedData(JSON.stringify(data2Mb));
                break;
            default:
                break;
        }
    };

    const handleSubmit = () => {
        // Tiến hành lấy thông tin secret-key từ local và giải mã secret-key
        const secretKey = decryptLocal(localStorage.getItem("secretKey"));
        console.log(selectedData)

        // Mã hóa thông tin truyền lên
        const cipherText =
            radioSelected === "None"
                ? encrypt(inputValue, secretKey)
                : encrypt(selectedData, secretKey);

        // Chuyển thông tin mã hóa thành dạng text
        setCipherTextString(cipherText);

        // Chuyển thông tin lên server
        postData(cipherText, secretKey)
            .then((res) => {
                setServerResponse(res);
                console.log("Thông tin mã hóa trả về: " + res);
            })
            .catch((error) => console.log(error));
    };

    const handleCancel = () => {
        setInputValue("");
        setCipherTextString("");
        setServerResponse("");
    };

    return (
        <div className="flex flex-col gap-y-2 w-[300px] px-2">
            <div className="font-bold">Input value</div>
            <form className="flex flex-row gap-x-2">
                <div className="flex flex-row gap-x-1">
                    <input
                        type="radio"
                        value="None"
                        checked={radioSelected === "None"}
                        onChange={handleOnchangeRadio}
                    />
                    <label>None</label>
                </div>

                <div className="flex flex-row gap-x-1">
                    <input
                        type="radio"
                        value="128"
                        checked={radioSelected === "128"}
                        onChange={handleOnchangeRadio}
                    />
                    <label>128kb</label>
                </div>

                <div className="flex flex-row gap-x-1">
                    <input
                        type="radio"
                        value="256"
                        checked={radioSelected === "256"}
                        onChange={handleOnchangeRadio}
                    />
                    <label>256kb</label>
                </div>

                <div className="flex flex-row gap-x-1">
                    <input
                        type="radio"
                        value="512"
                        checked={radioSelected === "512"}
                        onChange={handleOnchangeRadio}
                    />
                    <label>512kb</label>
                </div>

                <div className="flex flex-row gap-x-1">
                    <input
                        type="radio"
                        value="1024"
                        checked={radioSelected === "1024"}
                        onChange={handleOnchangeRadio}
                    />
                    <label>1Mb</label>
                </div>

                <div className="flex flex-row gap-x-1">
                    <input
                        type="radio"
                        value="2048"
                        checked={radioSelected === "2048"}
                        onChange={handleOnchangeRadio}
                    />
                    <label>2Mb</label>
                </div>
            </form>
            <input
                className="border rounded-md border-black p-1"
                value={inputValue}
                onChange={handleOnchange}
                type="text"
            />
            <div className="flex flex-row gap-x-2">
                <button
                    className="border rounded-md bg-stone-300 py-1 px-2 font-medium hover:bg-stone-400"
                    onClick={handleSubmit}
                >
                    Submit
                </button>
                <button
                    className="border rounded-md bg-stone-300 py-1 px-2 font-medium hover:bg-stone-400"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            </div>
            <div className="font-medium">Thông tin gửi lên</div>
            <div className="truncate">{cipherTextString}</div>
            <div className="font-medium">Thông tin trả về</div>
            <div className="">{serverResponse}</div>
        </div>
    );
}

export default InputValueComponent;
