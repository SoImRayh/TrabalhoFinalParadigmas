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


const options: string = 'namespace=dynamic-us&locale=pt_BR';
const token: string = '&access_token='+import.meta.env.VITE_APITOKEN
const actionurl = 'https://us.api.blizzard.com/data/wow/connected-realm/3234/auctions?'
const itemurl = 'https://us.api.blizzard.com/data/wow/item/'

interface Item {
    id: number,
    bonus_list: number[]
    modifiers: [{type: number, value: number}]
}
interface ActionItem {
    buyout: number,
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



export function Action(){
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerpage] = useState(10)
    const [items, setItems] = useState<ActionItem[]>([])

    useEffect(() => {
        fetch(`${actionurl}${options}${token}`).then( ( response ) => {
            response.json().then( ( data : APIResponse ) => {
                // @ts-ignore
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


  return (
      <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead className="bg-cyan-500">
                  <TableRow>
                      <TableCell>item</TableCell>
                      <TableCell align="right">QTD</TableCell>
                      <TableCell align="right">buyout</TableCell>
                      <TableCell align="right">time</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {(rowsPerPage > 0 ? items.slice(page * rowsPerPage , page * rowsPerPage + rowsPerPage): items).map(item => {

                      return(
                          <TableRow>
                              <TableCell>{item.item.id}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.buyout}</TableCell>
                              <TableCell>{item.time_left}</TableCell>
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
  );
}
