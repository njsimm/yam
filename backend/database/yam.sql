\echo 'Delete and recreate yam db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS yam;
CREATE DATABASE yam;
\connect yam

\i yam-schema.sql
\i yam-seed.sql

\echo 'Delete and recreate yam_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS yam_test;
CREATE DATABASE yam_test;
\connect yam_test

\i yam-schema.sql
