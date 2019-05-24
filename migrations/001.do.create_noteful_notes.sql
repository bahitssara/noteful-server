CREATE TABLE noteful_folders (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL
);

CREATE TABLE noteful_notes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    note_title TEXT NOT NULL,
    content TEXT NOT NULL,
    date_published TIMESTAMP DEFAULT now() NOT NULL
);