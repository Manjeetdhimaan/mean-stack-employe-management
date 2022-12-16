const fs = require('fs');

const deleteFile = (filePath) => {
    if (filePath) {
        fs.unlink(filePath, (err) => {
            if (err) {
                throw (err);
            }
        });
    } else {
        console.log('No image found!');
        return;
    }
}

exports.deleteFile = deleteFile;