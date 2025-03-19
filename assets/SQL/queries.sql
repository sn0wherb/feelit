CREATE TABLE IF NOT EXISTS emotions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, level INTEGER, parent TEXT, color TEXT);

INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Happy', 1, NULL, 'green');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Sad', 1, NULL, 'yellow');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Disgusted', 1, NULL, 'orange');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Angry', 1, NULL, 'red');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Fearful', 1, NULL, 'purple');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Bad', 1, NULL, 'blue');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Surprised', 1, NULL, 'turquoise');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Playful', 2, 'Happy', 'green');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Content', 2, 'Happy', 'green');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Interested', 2, 'Happy', 'green');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Proud', 2, 'Happy', 'green');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Accepted', 2, 'Happy', 'green');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Powerful', 2, 'Happy', 'green');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Peaceful', 2, 'Happy', 'green');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Trusting', 2, 'Happy', 'green');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Optimistic', 2, 'Happy', 'green');