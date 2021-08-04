const fs = require('fs')

require('dotenv').config();

const S3 = require('aws-sdk/clients/s3');

const s3BucketName = process.env.AWS_S3_BUCKET_NAME;
const s3BucketRegin = process.env.AWS_S3_BUCKET_REGIN;
const awsUserAccessKey = process.env.AWS_ACCESS_KEY;
const awsUserSecretKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
	s3BucketRegin,
	awsUserAccessKey,
	awsUserSecretKey,
});

// Upload a file to S3
function uploadFile(file) {
	const fileStream = fs.createReadStream(file.path);

	const uploadParams = {
		Bucket: s3BucketName,
		Body: fileStream,
		Key: file.filename,
	};

	return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;

// DownLoad a file from S3
function getFileStream(fileKey) {
	const downloadParams = {
		Key: fileKey,
		Bucket: s3BucketName,
	};

	return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;
