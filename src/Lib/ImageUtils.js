import Jimp from 'jimp'

import Vibrant from 'node-vibrant'
import TinyColor from 'tinycolor2'

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

    static rgbToHex (rgb) { 
        var hex = parseInt(Number(rgb)).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    }

    static fullColorHex ([r, g, b]) {   
        var red = this.rgbToHex(r);
        var green = this.rgbToHex(g);
        var blue = this.rgbToHex(b);
        return red + green + blue;
    };

    static async addImageToLeftHalfOfImage (imageUri, sourceImageUri) {
        try {
            let destImage = await Jimp.read(imageUri);
            let srcImage = await Jimp.read(sourceImageUri);

            // Resize source image to fill 50% or 100% of destination width
            srcImage.resize(destImage.getWidth() / 2, Jimp.AUTO);
            // Resize destination image to make space for modified source image
            // Make space for scaled source image in destination image
            let totalHeight = srcImage.getHeight() + destImage.getHeight();
            //
            let eBase64 = await srcImage.getBase64Async(Jimp.MIME_JPEG)
            let ePalette = await Vibrant.from(eBase64).getSwatches()
            console.log(ePalette)
            let eHex8 = TinyColor((ePalette.DarkMuted || ePalette[Object.keys(ePalette)[0]]).getHex()).toHex8()
            let bg = "0x" + eHex8
            // console.log("bg", bg, parseInt(bg), this.fullColorHex(ePalette.LightVibrant.getRgb()), ePalette.LightVibrant.getRgb(), destImage._background)
            destImage.background(parseInt(bg))

            destImage.contain(destImage.getWidth(), totalHeight, Jimp.VERTICAL_ALIGN_TOP);
            destImage.composite(srcImage, 0, totalHeight - srcImage.getHeight(), {
                mode: Jimp.BLEND_SOURCE_OVER,
                opacitySource: 1.0,
                opacityDest: 1.0
            });
            
            let base64 = await destImage.getBase64Async(Jimp.MIME_JPEG);
            return {
                destImageSrc: base64,
                srcImage
            };
        }
        catch (e) {
            throw e;
        }
    }

    static async addTextToImage (imageURI, { title, phrase }, embeddedImage) {
        const text = phrase
        try {
            let image = await Jimp.read(imageURI);
            let font64 = `${window.location.origin}/fonts/p-sans-i-64.fnt`;
            let font32 = `${window.location.origin}/fonts/p-sans-i.fnt`;
            let padding = 16;
            // let font64 = `${window.location.origin}/fonts/open-sans-64-white.fnt`;
            // let font32 = `${window.location.origin}/fonts/open-sans-32-white.fnt`;

            const f32 = await Jimp.loadFont(font32);
            const f64 = await Jimp.loadFont(font64); // open-sans-64-white.fnt

            let eW = embeddedImage.getWidth()
            let eH = embeddedImage.getHeight()
            
            let w64 = Jimp.measureText(f64, text);
            let h64 = Jimp.measureTextHeight(f64, text, eW);
            let w32 = Jimp.measureText(f32, text);
            let h32 = Jimp.measureTextHeight(f32, text, eW);
            console.log(w64, h64, w32, h32, eW, eH)

            let font;
            if (h64 < eH) {
                font = f64;
            }
            else {
                font = f32;
            }
            
            let initialHeight = image.getHeight() - eH
            image.print(font, eW + padding, initialHeight + padding, {
                text,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            }, eW - padding, eH - padding);
            
            let base64 = await image.getBase64Async(Jimp.MIME_JPEG);
            return base64;
        }
        catch (e) {
            throw e;
        }
    }
}