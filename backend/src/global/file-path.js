const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports.paramsReadFile = (type) => require(`../json/${type}.json`)["details"][0]
module.exports.all_short_name = () => require('./all_short_name.json')
module.exports.paramsIndex2 = (type) => require(`../json/${type}.json`)["details"][1] || {}
module.exports.formatParamsList = () => require(`../json/format_params.json`)

module.exports.paramsIndex3 = (type) => {
    return require(`../json/${type}.json`)["details"][2] || {}
}

module.exports.paramsIndex3ForClient = (type) => {
    return require(`../json/${type}.json`)["details"][3] || {}
}

module.exports.paramsOBISReadFile = (type) => {
    const data = require(`../json/${type}.json`)["details"][0]
    return Object.values(data)
}

module.exports.params_short_name_read = (type) => {
    const data = require(`../json/${type}.json`)["details"][0]
    return Object.keys(data)
}

module.exports.licenseFileRoot = () => {
    const userInfo = os.userInfo();
    const filePath = path.join(`C:\\Users\\${userInfo.homedir.split('\\').reverse()[0]}\\AppData\\Local\\Programs\\tegma`);

    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
    }

    return path.join(filePath, 'license.txt');
}