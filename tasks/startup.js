var models = require('../app/models');
var utils = require('../app/utils');
var env = process.env.NODE_ENV || 'development';
var dbConfig = require(__dirname + '/../config/database')[env];
var _ = require('lodash');
var tasks = require('./index');
var port = process.env.PORT || 3000;
var npm = require('npm');
var debug = require('debug')('lightning:server:startup');

var f = function() {
    models.sequelize.sync({force: false})
        .then(function() {

            models.VisualizationType
                .findAll()
                .then(function(vizTypes) {
                    debug('Installed visualizations:');
                    debug('-------------------------');
                    _.each(vizTypes, function(vt) {
                        debug('* ' + vt.name);
                    })
                    if(vizTypes.length === 0) {
                        npm.load({
                            loglevel: 'error'
                        }, function() {
                            tasks.getDefaultVisualizations();
                        });
                    }
                });
        }).catch(function(err) {
            debug('Could not connect to the database. Is Postgres running?');
            throw err;
        });


    debug(utils.getASCIILogo().magenta);

    debug('Lightning started on port: ' + port);
    debug('Running database: ' + dbConfig.dialect);
};

module.exports = f;