import axios from "axios";

interface WowTokenProps{
    nome: string
    valor: number
}

export function WowToken(props : WowTokenProps){


    return (
        <div className="flex gap-3">
            <div>
                <img src="https://wow.zamimg.com/images/wow/icons/large/wow_token01.jpg" alt="nao deu para carergar"/>
            </div>
            <div className="text-left">
                <label htmlFor="price" className="block text-sm font-medium text-white">{props.nome} </label>
                <div className="flex gap-2">
                    <img src={"./public/Gold.webp"} alt=""/>
                    <span className="text-white font-black text-sm">{props.valor/10000}</span>
                </div>
            </div>
        </div>
    )
}
