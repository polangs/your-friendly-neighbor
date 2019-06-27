
DROP TABLE popular;

CREATE TABLE IF NOT EXISTS popular (
  id SERIAL PRIMARY KEY,
  query VARCHAR(255),
  formatted_query VARCHAR(255),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7)
);


INSERT INTO popular (query, formatted_query, latitude, longitude ) VALUES (
  'banff', 
  'Banff, AB, Canada', 
  51.1783629,
  -115.5707694
);