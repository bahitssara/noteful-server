const express = require('express')
const NotefulService = require('../src/noteful-services')
const notefulRouter = express.Router()

const serializedNotes = note => ({
    id: note.id,
    note_title: note.note_title,
    content: note.content,
    date_published: note.date_published,
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

notefulRouter
    .route('/notes/:id')
    .all((req, res, next) => {
        const { id } = req.params;
        NotefulService.getById(req.app.get('db'), id)
            .then(note => {
                if(!note) {
                    return res
                    .status(404)
                    .send({ error: { message: `Note doesn't exists`} })
                }
                res.note = note
                next()
            })
            .catch(next)
    })
    .get((req, res) => {
        res.json(serializedNotes(res.note))
    })

module.exports = notefulRouter

