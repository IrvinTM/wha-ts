import {AuthenticationState, makeWASocket, useMultiFileAuthState}  from 'baileys'
import P  from 'pino'


const usePostgressAuthState = ()=>{
    return{
        //TODO return a state object and a function that saves the creds to the database
        state:
    }
    
}

async function connectToWhatsApp () {
    const { state, saveCreds } = await usePostgressAuthState()
    const sock = makeWASocket({
        auth: state,
        logger: P(),
    })
        

    sock.ev.on('connection.update', (con)=>{
        console.log(con)
    })

    sock.ev.on('creds.update', saveCreds)
}





connectToWhatsApp()
