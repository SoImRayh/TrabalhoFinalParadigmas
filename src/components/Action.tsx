import React, {Component, useEffect, useState} from "react";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter, TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import ReactDOM, {createRoot} from "react-dom/client";
import {WowToken} from "./WowToken/WowToken";
import {render} from "react-dom";
import {WowItem} from "./WoWItem/WowItem";
import {ItemAPIResponse} from "../domain/interface/ItemAPIResponse";
import {ItemPrice} from "./Preco/ItemPrice";
import {getPaths} from "../workers/jsonPath";
import { Carrinho } from "./carrinho/Carrinho";


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
        setComponentes((rowsPerPage > 0 ? items.slice(page * rowsPerPage , page * rowsPerPage + rowsPerPage): items))
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



    const handleChangePage = ( event : React.MouseEvent<HTMLButtonElement>  | null , newPage: number) => {

        setPage(newPage)
    }

    const handleRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        setRowsPerpage(parseInt(event.target.value, 10))
        setPage(0)
    }

    /*
    *
    * faz o fetch na api da blizzard para buscar as imagens, o proposito e atender o requisito 1 do trabalho que é fazer
    * buscas assíncronas sob demanda
    * @param data dados brutos do item
    *
    * @return:
    *   renderiza o componente WoWItem no item com o 'id' passado*/


    const getImage = (id)

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

    const carrinhos = carrinho.map(element => {
        return(
            <div className="flex gap-8">
                <h2 className="bg-cyan-600">Action:{element.id}</h2>
                <h2>Quantidade: {element.quantity}</h2>
            </div>
        )
    })

  return (
      <div className="flex-1 items-center">
            <div>
                historico de compras <br/>
                {carrinhos}
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
                      (rowsPerPage > 0 ? items.slice(page * rowsPerPage , page * rowsPerPage + rowsPerPage): items).map((actionItem, index) => {
                      return(
                          <TableRow key={index}>
                              <TableCell>
                                  {() => {
                                      return(
                                          <div className="flex ">
                                              <img src="" alt="nao deu" className="h-8 w-8"/>
                                              <h2 className="text-center">naftalina</h2>
                                          </div>
                                      )
                                  }

                                  }
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
