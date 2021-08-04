const express = require('express');
const multer = require('multer');

const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

const upload = multer({ dest: 'uploads/' });

const { uploadFile, getFileStream } = require('./s3');

const app = express();

app.get('/images/:key', (req, res) => {
  const key = req.params.key;

  const readStream = getFileStream(key);

  readStream.pipe(res);
})

app.post('/images', upload.single('image'), async (req, res) => {
	const file = req.file;
	//console.log(file);

  // Upload to S3 & Delete it in our folder after success of uploading
	const resultFromS3 = await uploadFile(file);
  await unlinkFile(file.path)
	//console.log(resultFromS3);

	const description = req.body.description;
	res.send({ imagePath: `/images/${resultFromS3.Key}` });
});

app.listen(7000, () => console.log('listening on port 7000'));
