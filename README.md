# EnglishAm

## Run

### 1. Start MySQL (Docker)

```bash
docker start eng-mysql
```

First time only — create the container and load the dump:

```bash
docker run -d --name eng-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpw \
  -e MYSQL_DATABASE=english \
  -p 3307:3306 mysql:8.0

# wait ~15s for MySQL to initialize, then:
docker exec -i eng-mysql sh -c 'exec mysql -uroot -prootpw english' < english_18_01_19_backup.sql
```

### 2. Start Django backend (port 8000)

```bash
./venv/bin/python manage.py runserver 8000
```

First time only:

```bash
./venv/bin/pip install -r requirements.txt   # or: pymysql cryptography djangorestframework
./venv/bin/python manage.py migrate
./venv/bin/python manage.py createsuperuser   # admin / admin
```

### 3. Start React frontend (port 5173)

```bash
cd frontend && npm run dev
```

First time only:

```bash
cd frontend && npm install
```

## Open

- React admin: http://localhost:5173/
- Django admin: http://localhost:8000/admin/
- DRF API root: http://localhost:8000/api/

Login: `admin` / `admin`
