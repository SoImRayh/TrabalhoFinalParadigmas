
 self.onmessage = (e) =>{

         e =  fetch('https://meowfacts.herokuapp.com').then((response) => {
            response.json().then( json => {
                console.log(json.data)
                self.postMessage(json.data)
            })
        }).catch((e)=> {
            console.error(e.data)
        })

}