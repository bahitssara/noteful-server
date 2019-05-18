const express = require('express')
const FolderService = require('../src/folder-services')
const folderRouter = express.Router()

const serializedFolder = folder => ({
    id: folder.id,
    title: folder.title,
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

folderRouter
    .route('/folders/:id')
    .all((req, res, next) => {
        const { id } = req.params;
        FolderService.getById(req.app.get('db'), id)
            .then(folder => {
                if(!folder) {
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

module.exports = folderRouter