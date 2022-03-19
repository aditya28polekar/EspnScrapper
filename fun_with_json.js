const fs = require('fs');
const xlsx = require('xlsx');

let buffer = fs.readFileSync('./exampel.json')
//console.log(buffer);
let data = JSON.parse(buffer)


// data.push({
//     "name": "thor",
//     "last Name": "odin",
//     "isAvenger": true,
//     "friends": ["peter", "bruce"],
//     "age": 79,
//     "addres": {
//         "planet": "asgard"
//     }
// })
console.log(data);

let stringData = JSON.stringify(data);
console.log(stringData)
// fs.writeFileSync('exampel.json', stringData);
// console.log("json file updated")

function exelWriter(sheetName , fileName , jsonData){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(jsonData);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName)
    xlsx.writeFile(newWB, fileName);
}

function exelReader(fileName , sheetName){
    let wb = xlsx.readFile(fileName);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    console.log(ans)
}

