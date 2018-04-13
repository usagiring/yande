const axios = require('axios')
const fs = require('fs')
const https = require('https');
const _ = require('lodash')
const async = require('async-q')
const stream = require('stream');

export async function getPostJson(page = 1, tag) {
    let url = 'https://yande.re/post.json?'

    if (page) {
        url += `&page=${page}`
    }

    if (tag) {
        url += `&tags=${tag}`
    }
    let result = await axios.get(url)

    return result.data
}

export async function download(imagesInfo, dirPath, bypass = 5) {
    if (!dirPath) {
        try {
            fs.accessSync(`./downloads`)
        } catch (e) {
            fs.mkdirSync(`./downloads`)
        }
        dirPath = `./downloads/`
    }

    let exists = fs.readdirSync(dirPath)
    imagesInfo = imagesInfo.filter(item => !exists.find(name => name === `${item.md5}.${item.file_ext}`))
    let chunks = _.chunk(imagesInfo, bypass)
    return async.eachSeries(chunks, chunk => {
        return Promise.all(chunk.map(single => downloadSingle(single, dirPath)))
    })

    function downloadSingle({file_url, md5, file_ext}, dirPath) {
        let filePath = `${dirPath}${md5}.${file_ext}`
        return new Promise((resolve, reject) => {
            https.get(file_url, result => {
                result.pipe(fs.createWriteStream(filePath))
                    .on('close', () => {
                        resolve()
                    })
                    .on('error', err => {
                        reject(err)
                    })
            });

            // should a bug with axios

            // let result = await axios.get(file_url, {
            //     responseType: 'stream'
            // })
            // result.data.pipe(fs.createWriteStream(`${md5}.${file_ext}`))
            //     .on('close', () => {
            //         resolve()
            //     })
            //     .on('error', err => {
            //         reject(err)
            //     })
        })

    }
}

export async function downloadPackage() {
    let imagesInfo = await getPostJson()
    await download(imagesInfo)
    console.log('success')
}