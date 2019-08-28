# api-exercise-tracker

- Completed as a part of FCC Apis and Microservices Projects.
- Based on fcc example code with modifications.

## Modifications
1. New design: Dark theme and mobile friendly
2. Ajax functionality: Stay on the page and render results on the screen.
3. Search input control: Added input control for searching database for exercise logs.
4. Error display: display errors on log panel.

## Things I learned from this project
1. You can implement ajax with client.js in public folder.  
   You make request from the client side: `GET` or `POST` with form data.
   Server.js will set route handlers for individual request (path specified in form's action attribute)
2. Use jQuery(heavy), fetch(native but inconvenient), or axios.js instead of `XMLHttpRequest`for client side AJAX (avoid reinventing the wheel)


## server.js
1. Add 'submit' listener to form elements, make http request and handle response.
2. For `server.js`, use all the neccesary middleware first (cors, bodyParser, express.static ..)
3. route root handler ('/'). send `index.html`
4. connect mongoose, app.use external router (`api.js')
5. mount 404 handler with no path
6. after 404, set error handling middleware
7. app.listen

## api.js
1. require Models
2. route each path and mount handler. next(err) for passing errors to error-handling middleware
3. query db with Model. CRUD. res.json(what_you_want_from_DB)
4. mongoose Model.find takes projection as 2nd arg. 
5. mongo collection.find takes option obj as 2nd arg. (or return cursor from find(query) and chain project(), sort(), limit(), etc...
6. You cannot add properties directly into mongoose documents. Use doc.toObject() to convert it into a plain object.
7. `new Date(date_string)` will return 'Invalid Date' if `date_string` is not in acceptable format.

## Models
### exercise.js
1. mongoose Schema String type option - `maxlength: [20, 'description too long']`
2. `index: true' sets secondary index for individual field.
3. Use `Scehma.pre('save', cb(next) { ...})` to modify document before save

### users.js
1. `shortid.js` is a package that generates short unique string id for each new document
   set `default: shortid.generate` option for the field you want to generate short id.
2. You should not set `index: true` option with the above. mongoose will not allow overwriting the default '_id' index.

        
