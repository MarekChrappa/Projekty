DROP DATABASE IF EXISTS db;

-- Create the database
CREATE DATABASE db;

-- Create table
CREATE TABLE db.images (
  id         INTEGER  NOT NULL AUTO_INCREMENT PRIMARY KEY,
  src        TEXT     NOT NULL,
  created_at DATETIME NOT NULL DEFAULT NOW(),
  updated_at DATETIME NOT NULL DEFAULT NOW() ON UPDATE NOW()
);

INSERT INTO db.images (`src`) VALUES
('https://c.tenor.com/KEzW7ALwfUAAAAAC/cat-what.gif'),
('https://cdn.discordapp.com/attachments/755689312472793250/1033471681978703952/ac1cc2db3c41de75f16f06b865b3e671.png'),
('https://cdn.discordapp.com/attachments/851785783425630241/953608658938388560/unknown.png'),
('https://cdn.discordapp.com/attachments/781622253292617748/951626049630912532/IMG_4850.png'),
('https://media.discordapp.net/attachments/838879399666253874/885249697952956436/unknown.png'),
('https://c.tenor.com/jQy0xVIQ_FgAAAAS/lol-risitas.gif');