const dotenv = require('dotenv').config();
const fetch = require('node-fetch');

const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
// const VENDOR_EMAIL_ADDRESS = process.env.VENDOR_EMAIL_ADDRESS
// const VENDOR_PASSWORD = process.env.VENDOR_PASSWORD
// const MANAGER_EMAIL_ADDRESS = process.env.MANAGER_EMAIL_ADDRESS
// const MANAGER_PASSWORD = process.env.MANAGER_PASSWORD

const LOGIN_URL = process.env.LOGIN_URL || 'http://localhost:6192/api/v2/users/login?portal=true';
const API_URL = process.env.API_URL || '';
let Bearer_Token = '';
const LOAD = process.argv[2] || Number(process.env.LOAD) || 1;

if (process.argv[2]) {
    console.log(`Load given by the user is ${process.argv[2]}`)
}

const loginCall = async () => {
    const headers = new fetch.Headers();
    headers.append('content-type', 'application/json');
    await fetch(LOGIN_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            email: ADMIN_EMAIL_ADDRESS,
            password: ADMIN_PASSWORD
        }),
    }).then((response) =>
        response.json())
        .then((response) => {
            Bearer_Token = response.data.user.token;
        }).catch((err) => {
            console.log('Login failed');
        });
}

const callAPI = async () => {
    if (!Bearer_Token || !Bearer_Token.length) return;
    const headers = new fetch.Headers();
    headers.append('authorization', `Bearer ${Bearer_Token}`);
    // attach body with JSON.Stringify as above done if POST call
    const res = await fetch(API_URL, {
        method: 'GET',
        headers: headers
    })
    // console.log(await res.json());
}

(async function () {
    await loginCall();
    let averageTime = Date.now();
    for (let i = 1; i <= LOAD; i++) {
        const startTime = Date.now();
        await callAPI();
        console.log(`${i}th API call done!`);
        const endTime = Date.now();
        averageTime += endTime - startTime;
    }
    console.log(`Average Time taken to call API: ${API_URL} is ${((averageTime % 60000) / 1000) / LOAD} seconds`);
})();

