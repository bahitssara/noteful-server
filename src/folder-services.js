const FolderService = {
    getAllFolders(knex) {
        return knex.select('*').from('noteful_folders')
    },
    insertNotes(knex, newFolders) {
        return knex
            .insert(newFolders)
            .into('noteful_folders')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('noteful_folders').select('*').where('id', id).first()
    },
    deleteNotes(knex, id) {
        return knex('noteful_folders')
            .where({ id })
            .delete()
    },
    updateArticle(knex, id, newFolderFields) {
        return knex('noteful_folders')
            .where({ id })
            .update(newFolderFields)
    }
}

module.exports = FolderService