// Load the module dependencies
const config = require('./config');
const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
var flash = require('connect-flash');


// Define the Express configuration method
module.exports = function () {
    // Create a new Express application instance
    const app = express();

    // Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    // Use the 'body-parser' and 'method-override' middleware functions
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Configure the 'session' middleware
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret // secret used to sign the session ID cookie
    }));

    // Set the application view engine and 'views' folder
    app.set('views', './app/views');
    app.set('view engine', 'ejs');
    app.engine('html', require('ejs').renderFile);

    app.use(flash());

    // Load the 'student' routing file
    require('../app/routes/application.server.routes')(app);
    require('../app/routes/prescreening.server.routes')(app);
    require('../app/routes/user.server.routes')(app);
    require('../app/routes/appointment.server.routes')(app);
    require('../app/routes/doctor.server.routes')(app);
    require('../app/routes/blog.server.routes')(app);
    require('../app/routes/registration.server.routes')(app);
    
    // Configure static file serving
    app.use(express.static('./public'));

    // Return the Express application instance
    return app;
};