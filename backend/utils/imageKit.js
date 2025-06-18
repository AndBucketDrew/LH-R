import ImageKit from "imagekit";
import * as dotenv from 'dotenv';

dotenv.config();

const imagekit = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

async function uploadImage(base64Image, fileName) {
    return await imagekit.upload({
        file: base64Image,
        fileName,
    });
}

export { imagekit, uploadImage }