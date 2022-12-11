

interface ItemPriceProps{
    price: number
}
export function ItemPrice(props: ItemPriceProps){

  return (
    <div className="flex gap-2">
        <div className="flex"><img src="/Gold.webp" alt=""/>{Math.ceil(props.price/10000)}</div>
        <img src="/Silver.webp" alt=""/>{(props.price%10000)/100}
        <img src="/Copper.webp" alt=""/>{ props.price%100}
    </div>
  );
}
