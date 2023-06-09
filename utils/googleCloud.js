// // Imports the Google Cloud client library
// const {Storage} = require('@google-cloud/storage');

// // For more information on ways to initialize Storage, please see
// // https://googleapis.dev/nodejs/storage/latest/Storage.html

// // Creates a client using Application Default Credentials
// const storage = new Storage();

// // Creates a client from a Google service account key
// // const storage = new Storage({keyFilename: 'key.json'});

// /**
//  * TODO(developer): Uncomment these variables before running the sample.
//  */
// // The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// async function createBucket() {
//   // Creates the new bucket
//   await storage.createBucket(bucketName);
//   console.log(`Bucket ${bucketName} created.`);
// }

// createBucket().catch(console.error);


async function uploadFile() {
  const options = {
    destination: destFileName,
    // Optional:
    // Set a generation-match precondition to avoid potential race conditions
    // and data corruptions. The request to upload is aborted if the object's
    // generation number does not match your precondition. For a destination
    // object that does not yet exist, set the ifGenerationMatch precondition to 0
    // If the destination object already exists in your bucket, set instead a
    // generation-match precondition using its generation number.
    preconditionOpts: {ifGenerationMatch: 0},
  };

  let res = await storage.bucket(bucketName).upload(filePath, options);
  console.log(`${filePath} uploaded to ${bucketName}`);
  console.log(res[0].metadata.selfLink);
}