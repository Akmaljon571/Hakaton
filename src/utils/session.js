const CustomError = require("./custom_error");

const createHash = (key, x) => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(x)).substr(-2);
    const applySaltToChar = code => textToChars(key).reduce((a, b) => a ^ b, code);

    return text => text.split('')
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join('');
}

const verifyHash = (key, x) => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code => textToChars(key).reduce((a, b) => a ^ b, code);
    return encoded => encoded.match(/.{1,2}/g)
        .map(hex => parseInt(hex, x))
        .map(applySaltToChar)
        .map(charCode => String.fromCharCode(charCode))
        .join('');
}

module.exports.sessionCreate = (id, key) => {
    try {
        const random = Math.floor(Math.random() * 2) + 1;
        return "" + createHash(key, random == 1 ? 16 : 32)(id) + random
    } catch (err) {
        throw new CustomError(err.status, err.message)
    }
}

module.exports.sessionParse = (hash, key) => {
    try {
        const code = hash[hash.length - 1]
        const sliceCode = hash.slice(0, -1);
        if (code == 1) {
            return verifyHash(key, 16)(sliceCode)
        } else if (code == 2) {
            return verifyHash(key, 32)(sliceCode)
        } else {
            throw new CustomError(405, 'Bad Session code')
        }
    } catch (err) {
        throw new CustomError(500, err.message)
    }
}
