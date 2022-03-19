//const url = 'https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard';
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const path = require('path');
const { dirname } = require('path');
const xlsx = require('xlsx')

function procssScorecard(url){
    request(url , cb);
}

function cb(err , res , html){
    if(err){
        console.log(err);
    }
    else{
        extractMathDetails(html);
    }

}

function extractMathDetails(html){
    let $ = cheerio.load(html);
    let str = $('.header-info .description').text();
    let descStringArr = str.split(',');
    console.log(descStringArr);

    let date = descStringArr[1].trim();
    let venue = descStringArr[2].trim();
    let res = $('.match-info.match-info-MATCH.match-info-MATCH-half-width .status-text').text()
    
    console.log(date);
    console.log(venue);
    console.log(res);

    // bought the statistic table of both teams
    let innigs = $('.card.content-block.match-scorecard-table>.Collapsible');
    let htmlString = '';

    for(let i = 0 ; i < innigs.length ; i++){
        htmlString += $(innigs[i]).html();
        let teamName = $(innigs[i]).find('h5').text();
        teamName = teamName.split('INNINGS')[0].trim();
        
        
        let opponentIdx = i==0 ? 1 : 0;
        let opponentName = $(innigs[opponentIdx]).find('h5').text();
        opponentName = opponentName.split('INNINGS')[0].trim();

        //console.log(teamName , opponentName);
        let cInning = $(innigs[i])

        let allrows = cInning.find('.table.batsman tbody tr');
        for(let j = 0 ; j < allrows.length ; j++){
            let allcols = $(allrows[j]).find('td');
            let isWorthy = $(allcols[0]).hasClass('batsman-cell') 
            if(isWorthy == true){
                let playerName = $(allcols[0]).text().trim();
                let runs = $(allcols[2]).text().trim();
                let balls = $(allcols[3]).text().trim();
                let fours = $(allcols[5]).text().trim();
                let six = $(allcols[6]).text().trim();
                let sr = $(allcols[7]).text().trim();
                
                console.log(`${playerName} | ${runs} | ${fours} | ${six} | ${sr}`)

                processPlayer(playerName , runs , balls , fours , six , sr , venue , date , res , teamName , opponentName)
            }
        }


        
    }

    

    //console.log('----------------')
    //console.log(htmlString);



 
}
function processPlayer(playerName , runs , balls , fours , six , sr , venue , date , res , teamName , opponentName)
{
    let teamPath = path.join(__dirname , "IPL" , teamName);
    dirCreater(teamPath)

    let filePath = path.join(teamPath , playerName+'.xlsx');
    
    let content = exelReader(filePath , playerName);

    let playerObj = {
        playerName , runs , balls , fours , six , sr , venue , date , res , teamName , opponentName
    }

    content.push(playerObj);
    exelWriter(filePath , playerName , content);



}
function dirCreater(path){
    if(fs.existsSync(path) == false){
        fs.mkdirSync(path);
    }
}

function exelWriter( fileName, sheetName , jsonData){
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(jsonData);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName)
    xlsx.writeFile(newWB, fileName);
}

function exelReader(fileName , sheetName){
    if(fs.existsSync(fileName) == false){
        return [];
    }

    let wb = xlsx.readFile(fileName);
    let excelData = wb.Sheets[sheetName];
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans
}

module.exports={
    ps : procssScorecard
}

