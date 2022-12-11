import {ItemAPIResponse} from "../../domain/interface/ItemAPIResponse";
import {useEffect, useState} from "react";


const url = 'https://us.api.blizzard.com/data/wow/media/item/'
const options = '?namespace=static-us&locale=en_US'
const token = '&access_token='+import.meta.env.VITE_APITOKEN
interface WowItemProps{
  item: ItemAPIResponse
}

export function WowItem(props : WowItemProps){

  const [img, setimg] = useState('')
  useEffect(()=> {
    fetch(`${url}${props.item.id}${options}${token}`).then( response => {
      response.json().then( data => {
        setimg(data.assets[0].value)
      })
    })
  },[])

  return (
    <div className="flex ">
      <img src={img} alt="nao deu" className="h-8 w-8"/>
      <h2 className="text-center">{props.item.name}</h2>
    </div>
  );
}
