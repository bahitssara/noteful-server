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

module.exports = notefulRouter

