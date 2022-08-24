### Basic Information
1. pindo_api folder is API script
2. pindo.postman_collection.json is file export via postman desktop
3. pindo_db.sql is database

### API 
using node.js, these are depedencies :
```
npm install --save express body-parser
npm install pg
```
### Postman
Call API from postman desktop. import `pindo.postman_collection.json` via postman dekstop

### Database
using postgres. Backup use script pg_dump, if want to restore use pg_restore.