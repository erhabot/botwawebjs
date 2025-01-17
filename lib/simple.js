import { fileTypeFromBuffer } from 'file-type';
import wweb from 'whatsapp-web.js'
const { Client, MessageMedia } = wweb
import fetch from 'node-fetch'
import '../handler.js'
import fs from 'fs';
import { fileURLToPath } from "node:url"
import path from 'path'
import { toAudio, toVideo } from './converter.js'
import axios from 'axios';
const __dirname = path.dirname(fileURLToPath(import.meta.url))

class client extends Client {

            /**
             * Membuffer file.
             * @param {fs.PathLike} PATH 
             * @param {Boolean} saveToFile
             */
    async getFile(PATH, saveToFile = false) {
        let filename;
        const res = await fetch(PATH)
        //if (!Buffer.isBuffer(res)) throw new TypeError('Result is not a buffer')
        const buff = Buffer.from(await res.arrayBuffer())
         const type = await fileTypeFromBuffer(buff) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        if (res && saveToFile && !filename) (filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, buff))
        return {
            filename,
            deleteFile() {
                return filename && fs.promises.unlink(filename)
            }
        }
    }
            /**
             * Mengirim Video / Gambar dari URL (https://)
             * @param {String} jid
             * @param {String|Buffer} url
             * @param {String} caption
             */
    async sendFileUrl(jid, url, caption = '') {
        const res = await fetch(url)
		const buff = Buffer.from(await res.arrayBuffer())
       let m;
        try {
            m = await conn.sendMessage(jid, new MessageMedia((await fileTypeFromBuffer(buff)).mime, buff.toString("base64")), { caption: caption });
        } catch (e) {
            console.error(e)
            m = null
        } finally {
            if (!m) m = await conn.sendMessage(jid, new MessageMedia((await fileTypeFromBuffer(buff)).mime, buff.toString("base64")), { caption: caption });
            return m
        }
    }

                /**
             * Mengirim Video / Gambar dari Path (aaaaaa)
             * @param {String} jid
             * @param {String|Buffer} path
             * @param {String} caption
             */
    async sendFilePath(jid, path, caption = '') {
                   let m;
                    try {
                        m = await conn.sendMessage(jid, MessageMedia.fromFilePath(path), { caption: caption });
                    } catch (e) {
                        console.error(e)
                        m = null
                    } finally {
                        if (!m) m = conn.sendMessage(jid, MessageMedia.fromFilePath(path), { caption: caption });
                        return m
                    }
                }
       
    

            /**
             * Mengirim Video / Gambar dari JSON
             * @param {String} jid
             * @param {String|Buffer} link
             * @param {String} caption
             */
    async sendFile(jid, link, caption = '') {
        let type = await conn.getFile(link, true)
        let {filename } = type
       let m;
        try {
            m = await conn.sendMessage(jid, MessageMedia.fromFilePath(filename), { caption: caption });
        } catch (e) {
            console.error(e)
            m = null
        } finally {
            if (!m) m = await conn.sendMessage(jid, MessageMedia.fromFilePath(filename), { caption: caption });
            return m,
            fs.unlink(filename, err => {
                if (err) throw console.log(err);
              });

        }
    }
            /**
             * Mengirim hasil dari JSON menjadi teks)
             * @param {String} jid
             * @param {String} link
             */
    async json(jid ,link) {
        let json = JSON.stringify(link)
        let m;
        try {
            m = conn.sendMessage(jid, `${json}`);
        } catch (e) {
            m = conn.sendMessage(jid, `${e}`);
        }
    }


}


export { client }


let fileP = fileURLToPath(import.meta.url)
fs.watchFile(fileP, () => {
    fs.unwatchFile(fileP)
    console.log(`Update File "${fileP}"`)
    import(`${import.meta.url}?update=${Date.now()}`)
})