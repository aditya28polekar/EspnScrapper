const url = 'https://www.espncricinfo.com/series/ipl-2020-21-1210595';
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const path = require('path');

let iplPath = path.join(__dirname , "IPL");
dirCreater(iplPath);

const getAllMatchObj = require('./allMatch')

request(url , cb);

function cb(err , res , html){
    if(err){
        console.log(err);
    }
    else{
        extractLink(html);
    }

}

function extractLink(html){
    let $ = cheerio.load(html);
    let anchorElem = $('a[data-hover="View All Results"]');
    let link = anchorElem.attr('href');
    //console.log(link)
    let fullLink = 'https://www.espncricinfo.com/' + link;
    console.log(fullLink);
    
    getAllMatchObj.getAllMatch(fullLink)
}

function dirCreater(path){
    if(fs.existsSync(path) == false){
        fs.mkdirSync(path);
    }
}








