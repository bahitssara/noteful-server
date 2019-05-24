const express = require('express')
const logger = require('../logger')
const xss = require('xss')
const NotefulService = require('../src/noteful-services')
const notefulRouter = express.Router()
const bodyParser = express.json()

const serializedNotes = note => ({
    id: note.id,
    note_title: xss(note.note_title),
    content: xss(note.content),
    date_published: new Date (note.date_published),
    folder: note.folder
})

notefulRouter
    .route('/notes')
    .get((req, res, next) => {
        NotefulService.getAllNotes(req.app.get('db'))
            .then(notes => {
                res.json(notes.map(serializedNotes))
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { note_title, content, folder } = req.body

        if(!note_title) {
            logger.error(`Title is required`);
            return res 
                .status(400)
                .send({
                    error: { message: `Missing 'title' in request`}
                })
        }

        if(!content) {
            logger.error(`Content is required`);
            return res
                .status(400)
                .send({
                    error: { message: `Missing 'content' in request`}
                })
        }

        if(!folder) {
            logger.error(`Folder is required`);
            return res
                .status(400)
                .send({
                    error: { message: `Missing 'folder' in request`}
                })
        }

        const note = {
            note_title,
            content,
            folder
        };

        NotefulService.insertNotes(
            req.app.get('db'),
            note
        )
        .then(note => {
            logger.info(`Note with id ${note.id} created`);
            res
                .status(201)
                .location(`/notes/${note.id}`)
                .json(serializedNotes(note))
            })
            .catch(next)
    })

notefulRouter
    .route('/notes/:id')
    .all((req, res, next) => {
        const { id } = req.params;
        NotefulService.getById(req.app.get('db'), id)
            .then(note => {
                if(!note) {
                    return res
                    .status(404)
                    .send({ error: { message: `Note doesn't exist`} })
                }
                res.note = note
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(serializedNotes(res.note))
    })
    .delete((req, res, next) => {
        const { id } = req.params;
            NotefulService.deleteNotes(
                req.app.get('db'),
                id
            )
            .then(numRowsAffected => {
                logger.info(`Note with id ${id} deleted`);
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(bodyParser, (req, res, next) => {
        const { note_title, content } = req.body
        const noteToUpdate = { note_title, content }
  
        const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'title' or 'content'`
                }
            })
        }
        
        NotefulService.updateNotes(
            req.app.get('db'),
            req.params.id,
            noteToUpdate
        )
          .then(numRowsAffected => {
              res.status(204).end()
          })
          .catch(next)
      })

module.exports = notefulRouter

