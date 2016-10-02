'use strict'

import * as http from 'http';


export function getKrautText(): Promise<string> {
    console.log('inserting kraut');
    return new Promise((resolve, reject) => {
        http.get({
            host: 'www.krautipsum.com',
            path: '/api/kraut'
        }, (response) => {
            let kraut = '';
            response.on('data', (data) => {
                console.log(data);
                kraut += data;
            });
            response.on('end', () => {
                let krautString = JSON.parse(kraut).kraut;
                resolve(krautString);
            });
        });
    });
}