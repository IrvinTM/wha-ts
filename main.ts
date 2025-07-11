import { AuthenticationState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeWASocket, useMultiFileAuthState } from 'baileys'
import P from 'pino'
import { useMySQLAuthState } from 'mysql-baileys'
import 'dotenv/config'


async function connectToWhatsApp(sessionName: string) {

    const logger = P()

    const { state, saveCreds, removeCreds } = await useMySQLAuthState({
        session: sessionName, // required
        password: process.env.DB_PASSWORD as string, // required
        database: process.env.DB_NAME as string, // required
        host: process.env.DB_HOST,
        port: process.env.PORT ? parseInt(process.env.DB_PORT as string) : 3000,
        user: process.env.DB_USER,
    })

    const { error, version } = await fetchLatestBaileysVersion()
    if (error) {
        console.log(`Session: ${sessionName} | No connection, check your internet.`)
        return connectToWhatsApp(sessionName)
    }

    const sock = makeWASocket({
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        version: version
    })

    sock.ev.on('connection.update', (con) => {
        console.log(con)
    })

    sock.ev.on('creds.update', saveCreds)
}

connectToWhatsApp("session1")
