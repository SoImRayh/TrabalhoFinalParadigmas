import React, { useEffect, useState} from "react";
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


const options: string = 'namespace=dynamic-us&locale=pt_BR';
const token: string = '&access_token='+import.meta.env.VITE_APITOKEN
const actionurl = 'https://us.api.blizzard.com/data/wow/auctions/commodities?'
const itemurl = 'https://us.api.blizzard.com/data/wow/item/'

interface Item {
    id: number,
    bonus_list: number[]
    modifiers: [{type: number, value: number}]
}
interface ActionItem {
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
    const [items, setItems] = useState<ActionItem[]>([])

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
    const handleItemApi = ( data: { data : ItemAPIResponse,htmlid: string; } ) => {
        render(
            <WowItem
                item={data.data}
            />,document.getElementById('item'+data.htmlid))
    }

    worker.onmessage = (e) => {
        handleItemApi(e.data)
    }

    /*
    * handleItemsQuantityButton
    * usando para gerenciar o click no botão, o intuito é usar para iniciar a exchange no trabalho
    * isto é, pegar os items e começar a trabalhar com eles com workers
    * */
    const handleItemsQuantityButton = ( ) => {
        getPaths(items)
    }

  return (
      <div className="flex-1 items-center">
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
                      (rowsPerPage > 0 ? items.slice(page * rowsPerPage , page * rowsPerPage + rowsPerPage): items).map((item, index) => {
                      return(
                          <TableRow key={index}>
                              <TableCell id={'item'+index.toString()}>{item.item.id}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell><ItemPrice price={item.unit_price}/></TableCell>
                              <TableCell>{item.time_left}</TableCell>
                              <TableCell>
                                  <button className="text-white font-black"
                                      onClick={() => {
                                          worker.postMessage({item, index, token})
                                      }
                                        }>
                                      buscar Item
                                  </button>
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
