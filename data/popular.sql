
DROP TABLE popular;

CREATE TABLE IF NOT EXISTS popular (
  id SERIAL PRIMARY KEY,
  query VARCHAR(255),
  formatted_query VARCHAR(255),
  description TEXT
);


INSERT INTO popular (query, formatted_query) VALUES (
  'banff', 
  'Banff, AB, Canada'
);