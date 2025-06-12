const queries: { [key: string]: string } = {
  createCustomEmotionsTable: `
  CREATE TABLE IF NOT EXISTS user_created_emotions (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, parent TEXT, color TEXT, level INTEGER, isCustom INTEGER DEFAULT 1);
  `,
  createLogTable: `
  CREATE TABLE IF NOT EXISTS emotion_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, emotion TEXT, color TEXT, root TEXT, need TEXT, extra TEXT, created_at DATATIME DEFAULT CURRENT_TIMESTAMP, isEdited INTEGER DEFAULT 0);
  `,
  createLog: `
  INSERT INTO emotion_logs (emotion, root, need, extra) VALUES (?,?,?,?);
  `,
  createBodyDrawingSvgPathsTable: `
  CREATE TABLE IF NOT EXISTS bodydrawing_svg_paths (id INTEGER, path TEXT, color TEXT, size INTEGER, FOREIGN KEY(id) REFERENCES emotion_logs(id));
  `,
  createHiddenEmotionsTable: `
  CREATE TABLE IF NOT EXISTS hidden_emotions (name TEXT PRIMARY KEY);
  `,
  createPeopleTable: `
  CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, color TEXT);
  `,
  createEmotionLogPeopleTable: `
  CREATE TABLE IF NOT EXISTS emotion_log_people (log_id INTEGER, person_id INTEGER, FOREIGN KEY(log_id) REFERENCES emotion_logs(id), FOREIGN KEY(person_id) REFERENCES people(id));
  `,
  createPlacesTable: `
  CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, color TEXT);
  `,
  createEmotionLogPlacesTable: `
  CREATE TABLE IF NOT EXISTS emotion_log_places (log_id INTEGER, place_id INTEGER, FOREIGN KEY(log_id) REFERENCES emotion_logs(id), FOREIGN KEY(place_id) REFERENCES places(id));
  `,
};

export { queries };
