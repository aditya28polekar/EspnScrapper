const cheerio = require('cheerio')
const request = require('request')
const scoreCardObj = require('./scoreCard')

function getAllMatchesLink(uri){
    request(uri , function (err , res , html){
        if(err){
            console.log(err);
        }
        else{
            extractAllLink(html);
        }
    })

}

function extractAllLink(html){
    let $ = cheerio.load(html);
    let scoreCardArr = $('a[data-hover="Scorecard"]')

    for(let i = 0 ; i < scoreCardArr.length ; i++){
        let link = $(scoreCardArr[i]).attr('href');
        let fullLink = 'https://www.espncricinfo.com/' + link
        //console.log(fullLink);
        scoreCardObj.ps(fullLink);
    }

}

module.exports={
    getAllMatch : getAllMatchesLink
}