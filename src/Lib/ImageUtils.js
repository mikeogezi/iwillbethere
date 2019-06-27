

import Jimp from 'jimp'

// import sans64Fnt from '../Fonts/open-sans-64-black.fnt';
// import sans64Png from '../Fonts/open-sans-64-black.png'

export default class ImageUtils {
    static getBase64Image (img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    static addTextToImage (imageURI) {
        // console.log("Sans 64 Font", sans64Fnt, sans64Png)
        return new Promise((resolve, reject) => {
            Jimp.read(imageURI)
                .then(image => {
                    // image.blur(5)
                    // image.invert()
                    // image.getBase64Async(Jimp.MIME_JPEG)
                    //     .then(iSrc => {
                    //         resolve(iSrc, image)
                    //     })
                    //     .catch(err => {
                    //         console.log('here')
                    //         reject(err)
                    //     })

                    // Jimp.loadFont(sans64Fnt)
                    Jimp.loadFont(`${window.location.origin}/fonts/open-sans-64-white.fnt`)
                        .then(font => {
                            image.print(font, 0, 0,
                            {
                                text: 'Hello world!',
                                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
                            }, 500, 500)

                            image.getBase64Async(Jimp.MIME_JPEG)
                                .then(iSrc => {
                                    resolve(iSrc, image)
                                })
                                .catch(err => {
                                    console.log('here')
                                    reject(err)
                                })
                        })
                        .catch(err => {
                            console.log('funt')
                            reject(err)
                        })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
}