const FolderService = {
    getAllFolders(knex) {
        return knex.select('*').from('noteful_folders')
    },
    insertFolder(knex, newFolders) {
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
    deleteFolder(knex, id) {
        return knex('noteful_folders')
            .where({ id })
            .delete()
    },
    updateFolderName(knex, id, newFolderFields) {
        return knex('noteful_folders')
            .where({ id })
            .update(newFolderFields)
    }
}

module.exports = FolderService