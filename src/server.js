import express from 'express';
import multer from 'multer';
import glob from 'glob';

var storage = multer.diskStorage({
	destination: function(req,file,cb) {
		cb(null, './uploads');
	},
	filename: function(req,file,cb) {
		if (!fileList.includes(file.originalname)) {
			cb(null, file.originalname);
		} else {
			var dup = 1;
			var tempString = file.originalname.split('.')[0]+'copy';
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
	console.log('GET ' + requestedFileName);
	if (fileList.includes(requestedFileName)) {
		console.log('found file');
	}
});
app.get('/', (req, res) => {
	getFileList();
	res.render('index', {fileList: fileList});
	console.log('rendered');
});
app.post('/', upload.single('csv'), (req, res) => {
	console.log('Post at /');
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