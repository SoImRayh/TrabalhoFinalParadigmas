import { ActionItem } from "../Action";
import React from "react";

interface CarrinhoProps {
    items: ActionItem[]
}

export function Carrinho (props : CarrinhoProps) {
     return props.items.map((element, index) => {
        return(
            <div className="flex gap-8" key={index}>
                <h2 className="bg-cyan-600">Action:{element.id}</h2>
                <h2>Quantidade: {element.quantity}</h2>
            </div>
        )
    })
}