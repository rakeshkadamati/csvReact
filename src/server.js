import express from 'express';
import multer from 'multer';
import glob from 'glob';
import parse from 'csv-parse';
import fs from 'fs';

var storage = multer.diskStorage({
	destination: function(req,file,cb) {
		cb(null, './uploads');
	},
	filename: function(req,file,cb) {
		if (!fileList.includes(file.originalname)) {
			cb(null, file.originalname);
		} else {
			var dup = 1;
			var tempString = file.originalname.split('.')[0]+'Copy';
			//loop until tempString doesn't already exist
			while (fileList.includes(tempString+dup+'.csv')) {
				dup++;
			}
			//set file name
			cb(null, tempString+dup+'.csv');
		}
	}
});
var upload = multer({ storage: storage });
const app = express();
var fileList = [];
//routes
app.get('/csv/*.csv', (req, res) => {
	var requestedFileName = req.url.split('/')[2];
	if (fileList.includes(requestedFileName)) {
		res.render('fullTable', {filename: requestedFileName});
		res.end();
	}
	else
		res.send(requestedFileName + ' was not found.');
});
app.get('/api/*.csv', (req, res) => {
	var requestedFileName = req.url.split('/')[2];
	//parse csv and serve
	var records = [];
	if (fileList.includes(requestedFileName)) {
		fs.createReadStream('./uploads/'+requestedFileName)
		.pipe(parse({columns: true}, function(err, data) {
			if (err) {
				console.log(err);
				res.status(500).end();
			}
			else {
				res.send(data);
			}
		}))
	}
	else res.send('Invalid API call ' + requestedFileName + ' was not found.');
})
app.get('/', (req, res) => {
	getFileList();
	res.render('index', {fileList: fileList});
});
app.post('/', upload.single('csv'), (req, res) => {
	getFileList();
	res.status(204).end();
});

//get list of files already stored
function getFileList() {
	fileList = glob.sync('*.csv', {cwd: './uploads/'});
}

getFileList();
app.set('views', __dirname + '/client');
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 3000));
app.use('/public', express.static(__dirname + '/client/public'));
app.listen(app.get('port'), () => {
	console.log('Server running at http://localhost:' + app.get('port')+ '/');
});