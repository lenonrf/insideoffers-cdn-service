'use strict';

module.exports = function(app) {

	var multer = require('multer');

	var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
    	 	
			console.log('req.data', req.data);
        	console.log('file', file);

            cb(null, '/var/www/cdn_files')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now(); 
            cb(null, file.originalname)
        }
    });

    var upload = multer({ 
       	storage: storage,
        limits: 4
    }).single('file');


    app.post('/upload', function(req, res) {

        upload(req,res,function(err){

            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        })
    });


    app.get('/test', function(req, res) {
 		res.json({test:true});
    });



};
