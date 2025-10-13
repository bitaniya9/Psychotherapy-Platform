# Psychotherapy-Platform

**Postgres useful commands**

```
    sudo -u postgres psql
    # create role with password (run as system user that can run sudo)
    sudo -u postgres psql -c "CREATE ROLE "user" WITH LOGIN PASSWORD 'password';"

    # create database and set owner
    sudo -u postgres psql -c "CREATE DATABASE melkam_psychotherapy OWNER "user";"

    # (optional) grant privileges explicitly (usually owner already has them)
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE melkam_psychotherapy TO "user";"
```
