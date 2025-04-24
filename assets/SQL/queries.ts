const queries: { [key: string]: string } = {
  createAndPopulateEmotions: `
CREATE TABLE IF NOT EXISTS emotions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, level INTEGER, parent TEXT, color TEXT);

INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Happy', 1, NULL, 'green');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Sad', 1, NULL, 'yellow');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Disgusted', 1, NULL, 'orange');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Angry', 1, NULL, 'red');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Fearful', 1, NULL, 'purple');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Bad', 1, NULL, 'blue');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Surprised', 1, NULL, 'turquoise');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Playful', 2, 'Happy', '#99e28e');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Content', 2, 'Happy', '#91da85');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Interested', 2, 'Happy', '#85cb7a');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Proud', 2, 'Happy', '#78ba6d');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Accepted', 2, 'Happy', '#6dac63');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Powerful', 2, 'Happy', '#609658');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Peaceful', 2, 'Happy', '#547f4d');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Trusting', 2, 'Happy', '#45763d');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Optimistic', 2, 'Happy', '#3b6634');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Vulnerable', 2, 'Sad', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Despair', 2, 'Sad', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Guilty', 2, 'Sad', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Depressed', 2, 'Sad', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Hurt', 2, 'Sad', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Repelled', 2, 'Disgusted', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Awful', 2, 'Disgusted', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Disappointed', 2, 'Disgusted', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Disapproving', 2, 'Disgusted', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Critical', 2, 'Angry', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Distant', 2, 'Angry', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Frustrated', 2, 'Angry', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Aggressive', 2, 'Angry', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Mad', 2, 'Angry', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Bitter', 2, 'Angry', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Humiliated', 2, 'Angry', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Let down', 2, 'Angry', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Threatened', 2, 'Fearful', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Rejected', 2, 'Fearful', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Weak', 2, 'Fearful', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Insecure', 2, 'Fearful', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Anxious', 2, 'Fearful', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Scared', 2, 'Fearful', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Startled', 2, 'Surprised', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Confused', 2, 'Surprised', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Amazed', 2, 'Surprised', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Excited', 2, 'Surprised', 'white');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Aroused', 3, 'Playful', '#99e28e');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Cheeky', 3, 'Playful', '#91da85');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Free', 3, 'Content', '#99e28e');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Joyful', 3, 'Content', '#91da85');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Curious', 3, 'Interested', '#99e28e');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Inquisitive', 3, 'Interested', '#91da85');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Successful', 3, 'Proud', '#99e28e');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Confident', 3, 'Proud', '#91da85');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Respected', 3, 'Accepted', '#99e28e');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Valued', 3, 'Accepted', '#91da85');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Courageous', 3, 'Powerful', '#99e28e');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Creative', 3, 'Powerful', '#91da85');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Loving', 3, 'Peaceful', '#99e28e');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Thankful', 3, 'Peaceful', '#91da85');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Sensitive', 3, 'Trusting', '#99e28e');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Intimate', 3, 'Trusting', '#91da85');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Hopeful', 3, 'Optimistic', '#99e28e');
INSERT OR IGNORE INTO emotions (name, level, parent, color) VALUES ('Inspired', 3, 'Optimistic', '#91da85');
`,
  createLogTable: `
  CREATE TABLE IF NOT EXISTS emotion_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, emotion TEXT, color TEXT, root TEXT, need TEXT, extra TEXT, created_at DATATIME DEFAULT CURRENT_TIMESTAMP);
  `,
  createCustomEmotionsTable: `
  CREATE TABLE IF NOT EXISTS user_created_emotions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, parent TEXT, color TEXT, level INTEGER, isCustom INTEGER DEFAULT 1);
  `,
  createLog: `
  INSERT INTO emotion_logs (emotion, root, need, extra) VALUES (?,?,?,?);
  `,
  createBodyDrawingSvgPathsTable: `
  CREATE TABLE IF NOT EXISTS bodydrawing_svg_paths (id INTEGER, path TEXT, color TEXT, size INTEGER, FOREIGN KEY(id) REFERENCES emotion_logs(id));
  `,
};

export { queries };
