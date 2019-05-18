TRUNCATE noteful_folders, noteful_notes RESTART IDENTITY CASCADE;

INSERT INTO noteful_folders (title)
    VALUES
        ('Folder 1'),
        ('Folder 2'),
        ('Folder 3'),
        ('Folder 4');

INSERT INTO noteful_notes (note_title, content, date_published, folder)
    VALUES
        ('Note1', 'This is the note yes it is wow great note', '1/2/2018', 1),
        ('Note2', 'This is the note yes it is wow great note', '1/2/2018', 2),
        ('Note3', 'This is the note yes it is wow great note', '1/2/2018', 3),
        ('Note4', 'This is the note yes it is wow great note', '1/2/2018', 4);




