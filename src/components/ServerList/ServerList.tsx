
import React, {useEffect, useState} from 'react';
import {APIServerInterface} from "../../domain/interface/Realmsinterface";

const realmUrl: string = 'https://us.api.blizzard.com/data/wow/realm/index?';
const options: string = 'namespace=dynamic-us&locale=pt_BR';
const token: string = '&access_token='+import.meta.env.VITE_APITOKEN

export function ServerList(){


    const [selectedOption, setSelectedOption] = useState(null);
    const [servidores, setservidores] = useState()

    useEffect(() => {
        fetch(`${realmUrl}${options}${token}`).then( ( response ) => {
            response.json().then( ( data ) => {
                setservidores(data.realms.map( ( server: APIServerInterface ) => {
                    return (
                        <div key={server.id}>
                            <p>
                                server: {server.name} : {server.id}
                            </p>
                        </div>)
                }))
            }).catch( ( err ) => {
                console.error(err)
            })
        }).catch( ( err ) => {
            console.error(err)
        })
    },[])



    return (
        <div className="App">
            {servidores}
        </div>
  )
}
