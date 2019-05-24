const express = require('express')
const logger = require('../logger')
const xss = require('xss')
const FolderService = require('../src/folder-services')
const folderRouter = express.Router()
const bodyParser = express.json()

const serializedFolder = folder => ({
    id: folder.id,
    title:xss(folder.title),
})

folderRouter
    .route('/folders')
    .get((req, res, next) => {
        FolderService.getAllFolders(req.app.get('db'))
            .then(folders => {
                res.json(folders.map(serializedFolder))
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { title } = req.body;

        if(!title) {
            logger.error(`Title is required`)
            return res
                .status(400)
                .send({
                    error: { message: `Missing 'title' in request`}
                })
        }

        const folder = {
            title
        };

        FolderService.insertFolder(
            req.app.get('db'),
            folder
        )
        .then(folder => {
            logger.info(`Folder with id ${folder.id} created`)
            res 
                .status(201)
                .location(`/folders/${folder.id}`)
                .json(serializedFolder(folder))
        })
        .catch(next)
    })

folderRouter
    .route('/folders/:id')
    .all((req, res, next) => {
        const { id } = req.params;
        FolderService.getById(req.app.get('db'), id)
            .then(folder => {
                if(!folder) {
                    logger.info(`Folder with id:${id} doesn't exist`);
                    return res
                    .status(404)
                    .send({ error: { message: `Folder doesn't exist`} })
                }
                res.folder = folder
                next()
            })
            .catch(next)
    })
    .get((req,res) => {
        res.json(serializedFolder(res.folder))
    })
    .delete((req, res, next) => {
        const { id } = req.params;
            FolderService.deleteFolder(
            req.app.get('db'),
            id
            )
            .then(numRowsAffected => {
            logger.info(`Folder with id ${id} deleted.`)
            res.status(204).end()
            })
            .catch(next)
    })
    .patch(bodyParser, (req, res, next) => {
        const { title } = req.body
        const folderToUpdate = { title }
  
        const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
        if (!title) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain 'title'`
                }
            })
        }
        
        FolderService.updateFolderName(
            req.app.get('db'),
            req.params.id,
            folderToUpdate
        )
          .then(numRowsAffected => {
              res.status(204).end()
          })
          .catch(next)
      })

module.exports = folderRouter