const imageKit = require("@imagekit/nodejs");
const ImageKit = new imageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});
module.exports = ImageKit;