const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const json2csv = require('json2csv').Parser;


//https://github.com/request/request-promise

const URLS = [
    'https://www.imdb.com/title/tt11126994/?ref_=hm_tpten_tt_i_3',
    'https://www.imdb.com/title/tt0903747/?ref_=hm_tpks_tt_i_2_pd_tp1_pbr_ic'
];

(async () => {
    let moviesData = [];

    for (let movie of URLS) {

    const response = await request({
        uri: movie,
        headers: {
            'User-Agent': 'Request-Promise',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-US,en;q=0.5',
            'Alt-Used': 'www.imdb.com',
            'Connection': 'keep-alive',
            'Host': 'www.imdb.com',
            'Priority': 'u=4',
            'Referer': 'https://www.imdb.com/title/tt11126994/?ref_=hm_tpten_tt_i_3',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0'
        },
        gzip: true
    });

    let $ = cheerio.load(response);

    let title = $('h1').text();
    let rating = $('.sc-d541859f-1').text();
    let movieImage = 'https://www.imdb.com' + $('.ipc-lockup-overlay,.ipc-focusable > a').attr('href');
    let totalRatings = $('.sc-d541859f-3').text();
    let releaseDate = $('div.sc-5766672e-2,.bizeKj').text();
    let popularity = $('div.sc-3a4309f8-0:nth-child(2) > div:nth-child(1) > div:nth-child(3) > a:nth-child(2) > span:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)').text();

    let genres = [];
    $(".ipc-chip-list--baseAlt,.ipc-chip-list,.ipc-chip-list--nowrap,.sc-3ac15c8d-4.eFIDNe > a[href^='/interest/']").each((i, elm) => {
        let genre = $(elm).text();
        genres.push(genre);
    })

    moviesData.push({
        title,
        rating,
        movieImage,
        totalRatings,
        genres
    });

    // const fields = ['title', 'rating'];
    const parser = new json2csv();
    const csv = parser.parse(moviesData);

    fs.writeFileSync('./data.csv', csv, 'utf-8');
    // fs.writeFileSync('./data.json', JSON.stringify(moviesData), 'utf-8');
    console.log(csv);


    }
})()