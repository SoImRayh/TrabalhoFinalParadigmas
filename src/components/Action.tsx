import React, { useEffect, useState} from "react";
import {

    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter, TableHead,
    TablePagination,
    TableRow
} from "@mui/material";

import {ItemPrice} from "./Preco/ItemPrice";
import {getPaths} from "../workers/jsonPath";
import {WowItem} from "./WoWItem/WowItem";
import {Carrinho} from "./carrinho/Carrinho";



const options: string = 'namespace=dynamic-us&locale=pt_BR';
const token: string = '&access_token='+import.meta.env.VITE_APITOKEN
const actionurl = 'https://us.api.blizzard.com/data/wow/auctions/commodities?'
const itemurl = 'https://us.api.blizzard.com/data/wow/item/'

export interface Item {
    id: number,
    bonus_list: number[]
    modifiers: [{type: number, value: number}]
}

export interface ActionItem {
    unit_price: number,
    id: number,
    item: Item
    quantity: number,
    time_left: string
}
interface APIResponse {
    auctions: ActionItem[]
    commodities: {
        ref: string
    }
    connected_realm: {
        ref: string
    }
    _links: {
        self :{
            ref: string
        }
    }
}


const worker = new Worker('src/workers/worker.js')
export function Action(){
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [carrinho, setcarrinho] =  useState<ActionItem[]>([])
    const [items, setItems] = useState<ActionItem[]>([])
    const [componentes, setComponentes] = useState<ActionItem[]>([])

    useEffect(() => {

        fetch(`${actionurl}${options}${token}`).then( ( response ) => {
            response.json().then( ( data : APIResponse ) => {
                setItems(data.auctions)
            }).catch( ( err ) => {
                console.error(err)
            })
        }).catch( ( err ) => {
            console.error(err)
        })
    },[])

    useEffect( () => {
        setComponentes((rowsPerPage > 0 ? items.slice(page * rowsPerPage , page * rowsPerPage + rowsPerPage): items))
    },[items, page])



    const handleChangePage = ( event : React.MouseEvent<HTMLButtonElement>  | null , newPage: number) => {
        setComponentes([])
        setPage(newPage)
    }

    const handleRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        setRowsPerpage(parseInt(event.target.value, 10))
        setPage(0)
    }

    /*
    * handleItemsQuantityButton
    * usando para gerenciar o click no botão, o intuito é usar para iniciar a exchange no trabalho
    * isto é, pegar os items e começar a trabalhar com eles com workers
    * */
    const handleItemsQuantityButton = ( ) => {
        getPaths(items)
    }

    const handleCarrinho =(elid : number ) => {
        if(carrinho.find(element => element.id === elid)){
            alert('quantidade maxima obtida')
            return
        }
        
        const item = items.find( element => element.id === elid)
        // @ts-ignore
        setcarrinho( oldcarrinho => {
            return ([...oldcarrinho, item]);
        })
    }



    return (
      <div className="flex-1 items-center">
            <div className="static">
                <Carrinho items={carrinho}/>
            </div>
          <div className="flex items-center">
              <img src={"public/logo.png"} alt="testando"/>
              <h2 className="text-4xl border-2 h-92 w-96">Action House oficial dos Crias ltda</h2>
          </div>
          <button onClick={handleItemsQuantityButton}> pegar quantidades</button>
      <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className="bg-cyan-500">
                  <TableRow>
                      <TableCell>item</TableCell>
                      <TableCell align="right">QTD</TableCell>
                      <TableCell align="right">buyout</TableCell>
                      <TableCell align="right">time</TableCell>
                      <TableCell align="center">action</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {
                      componentes.map((actionItem, index) => {
                          return(
                          <TableRow key={index}>
                              <TableCell>
                                  <WowItem itemId={actionItem.item.id}/>
                                </TableCell>
                              <TableCell>{actionItem.quantity}</TableCell>
                              <TableCell><ItemPrice price={actionItem.unit_price}/></TableCell>
                              <TableCell>{actionItem.time_left}</TableCell>
                              <TableCell>
                                  <button className="text-white font-black bg-cyan-600" onClick={() =>{
                                    handleCarrinho(actionItem.id)} }>comprar tudo</button>
                              </TableCell>
                          </TableRow>
                      )
                  })}
              </TableBody>
              <TableFooter>
                  <TableRow>
                      <TablePagination
                          count={Math.ceil(items.length/rowsPerPage)}
                          page={page}
                          rowsPerPage={rowsPerPage}
                          onRowsPerPageChange={handleRowsPerPage}
                          onPageChange={handleChangePage}/>
                  </TableRow>
              </TableFooter>
          </Table>
      </TableContainer>
      </div>
  );
}
