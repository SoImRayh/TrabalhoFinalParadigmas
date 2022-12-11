const url = 'https://us.api.blizzard.com/data/wow/item/'
const urloptions = '?namespace=static-us&locale=pt_BR'
 self.onmessage = (e) =>{
    fetch(`${url}${e.data.item.item.id}${urloptions}${e.data.token}`).then( response => {
        response.json().then( data => {
            self.postMessage({data, htmlid: e.data.index})
        })
    })
}