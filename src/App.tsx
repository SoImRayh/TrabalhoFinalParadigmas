
import './App.css'
import {useEffect, useState} from "react";
import {ServerList} from "./components/ServerList/ServerList";
import {Action} from "./components/Action";

const worker = new Worker('src/workers/worker.js')


export function App() {
    const [data, setdata] =  useState(new Array<string>(2))
    const clickhandle = () => {
        worker.postMessage(data)
        worker.onmessage = (e) => {
           setdata(e.data)
        }
    }

    return (
        <div>
            <Action/>
        </div>
    )
}

export default App