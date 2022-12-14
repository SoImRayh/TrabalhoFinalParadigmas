import {ItemAPIResponse} from "../../domain/interface/ItemAPIResponse";
import {useEffect, useState} from "react";
import {Item} from "../Action";


const url = 'https://us.api.blizzard.com/data/wow/media/item/'
const itemUrl = 'https://us.api.blizzard.com/data/wow/item/'
const options = '?namespace=static-us&locale=en_US'
const token = '&access_token='+import.meta.env.VITE_APITOKEN
interface WowItemProps{
  itemId: number
}

interface ItemAPI{
  id: number,
   name: string

  media: {
    id: number,
    key : {
      href : string
    }
  }
}

export function WowItem(props: WowItemProps) {

  const [img, setimg] = useState('')

  const [item, setitem] = useState<ItemAPI>()


  useEffect(() => {
    console.log(props.itemId)
    fetch(`${itemUrl}${props.itemId}${options}${token}`).then( response => {
      response.json().then(data => {
        setitem(data)
      })
    })
  }, [])

  /*
  * indo na API buscar a imagem do item para colocar no componente
  * */

  useEffect(() => {
    if(item){
      fetch(`${item.media.key.href}${token}`).then(response => {
        response.json().then(data => {
          setimg(data.assets[0].value)
        })
      })
    }
  }, [item])

  return (
      <div className="flex ">
        <img src={img} alt="nao deu" className="h-8 w-8"/>
        <h2 className="text-center">{item?.name}</h2>
      </div>
  );
}
