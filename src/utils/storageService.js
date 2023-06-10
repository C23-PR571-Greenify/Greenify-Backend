const { Storage } = require("@google-cloud/storage");
const { extname, join, resolve } = require("path");
const fs = require("fs");

const credentials = join(resolve(), "credentials.json");
const credentialsFile = fs.readFileSync(credentials);
const projectId = JSON.parse(credentialsFile.toString()).project_id;
const storage = new Storage({
  keyFilename: credentials,
  projectId: projectId,
});

const bucket = storage.bucket("tourism-capstone");

async function store(file, dir) {
  const name = `${+Date.now()}${extname(file.originalname)}`;

  const path = `${dir}${name}`;

  const blob = bucket.file(path);
  const blobStream = blob.createWriteStream({
    resumable: false,
    predefinedAcl: "publicRead",
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (error) => {
      reject(error);
    });

    blobStream.on("finish", async () => {
      resolve(`https://storage.googleapis.com/${bucket.name}/${path}`);
    });

    blobStream.end(file.buffer);
  });
}

const storageService = {
  store,
};

module.exports = { storageService };
