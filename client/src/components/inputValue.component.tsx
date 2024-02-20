import { useState } from 'react'
import CryptoJS, { AES } from 'crypto-js'
import { data128, data1Mb, data256, data2Mb, data512 } from '../test data/data'

const secretKey = 'SecretKeyTest123'

async function postData (encryptData: any) {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({data: encryptData})
    }
    const response = await fetch('http://localhost:9000/message',options)
    const data = await response.json()
    const dataDecrypt = AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8)
    return dataDecrypt
}

function InputValueComponent () {
    const [inputValue, setInputValue] = useState('')
    const [cipherTextString, setCipherTextString] = useState<any>(null)
    const [serverResponse, setServerResponse] = useState<any>(null)
    const [radioSelected, setRadioSelected] = useState<string>('None')
    const [selectedData, setSelectedData] = useState<any>(null)

    const handleOnchange = (event: any) => {
        setInputValue(event.target.value)
    }

    const handleOnchangeRadio = (event: any) => {
        setRadioSelected(event.target.value)
        switch (event.target.value) {
            case 'None':
                setSelectedData(null)
                break;
            case '128':
                setSelectedData(data128)
                break;
            case '256':
                setSelectedData(data256)
                break;
            case '512':
                setSelectedData(data512)
                break;
            case '1024':
                setSelectedData(data1Mb)
                break;
            case '2048':
                setSelectedData(data2Mb)
                break;
            default:
                break;
        }
    }

    const handleSubmit = () => {
        const cipherText = radioSelected === 'None'?AES.encrypt(inputValue, secretKey):AES.encrypt(JSON.stringify(selectedData), secretKey)
        setCipherTextString((cipherText).toString())
        postData(cipherText.toString()).then(
            res=>setServerResponse(res)
        ).catch(error=>console.log(error))
    }

    const handleCancel = () => {
        setInputValue('')
        setCipherTextString(null)
        setServerResponse(null)
    }

    return (
        <div className='flex flex-col gap-y-2 w-[300px] px-2'>
        <div className='font-bold'>Input value</div>
        <form className='flex flex-row gap-x-2'>
            <div className='flex flex-row gap-x-1'>
                <input type='radio' value='None' checked={radioSelected === 'None'} onChange={handleOnchangeRadio}/>
                <label>None</label>
            </div>

            <div className='flex flex-row gap-x-1'>
                <input type='radio' value='128' checked={radioSelected === '128'} onChange={handleOnchangeRadio}/>
                <label>128kb</label>
            </div>

            <div className='flex flex-row gap-x-1'>
                <input type='radio' value='256' checked={radioSelected === '256'} onChange={handleOnchangeRadio}/>
                <label>256kb</label>
            </div>

            <div className='flex flex-row gap-x-1'>
                <input type='radio' value='512' checked={radioSelected === '512'} onChange={handleOnchangeRadio}/>
                <label>512kb</label>
            </div>

            <div className='flex flex-row gap-x-1'>
                <input type='radio' value='1024' checked={radioSelected === '1024'} onChange={handleOnchangeRadio}/>
                <label>1Mb</label>
            </div>

            <div className='flex flex-row gap-x-1'>
                <input type='radio' value='2048' checked={radioSelected === '2048'} onChange={handleOnchangeRadio}/>
                <label>2Mb</label>
            </div>
        </form>
        <input className='border rounded-md border-black p-1' value={inputValue} onChange={handleOnchange} type='text'/>
        <div className='flex flex-row gap-x-2'>
            <button className='border rounded-md bg-stone-300 py-1 px-2 font-medium hover:bg-stone-400' onClick={handleSubmit}>Submit</button>
            <button className='border rounded-md bg-stone-300 py-1 px-2 font-medium hover:bg-stone-400'onClick={handleCancel}>Cancel</button>
        </div>
        <div className='font-medium'>Thông tin gửi lên</div>
        <div className='truncate'>{cipherTextString}</div>
        <div className='font-medium'>Thông tin trả về</div>
        <div className=''>{serverResponse}</div>
        </div>
    )
}

export default InputValueComponent