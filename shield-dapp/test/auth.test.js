
const {expect} =  require('chai');
const {Wallet} = require('ethers');
const _axios = require('axios');
const { wrapper }  = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const { SiweMessage } = require('siwe');

const getMessage = (address, nonce, chainId)=>
    new SiweMessage({
        domain: 'wagmi.sh',
        address,
        statement: 'Sign in with Ethereum Wallet to the app.',
        uri: 'https://wagmi.sh',
        version: '1',
        chainId,
        nonce
    });


const jar = new CookieJar();
const baseURL = "http://localhost:3000/api";
const axios = wrapper(_axios.create({
    baseURL, jar
  }));

describe('Authentication', function () {
    let user;
    let nonce;
    let token;

    before(function(){
        user = Wallet.createRandom();
    });

    it('get Nonce', async function () {
        const response = await axios.get(`/auth?uid=${user.address}`);
        nonce = response.data.nonce;
        expect(response.status, "status should be OK").to.equal(200);
        expect(response.data.nonce).to.have.lengthOf.above(2);
    });

    it('send invalid signature', async function(){
        let message = getMessage(user.address, nonce, 100);
        const signature = await user.signMessage(message.prepareMessage());
        const response = await axios.post(`/auth`,{signature:signature+'2', message}).catch(e=>e.response);
        expect(response.status, "status should be Bad request").to.equal(400);
        expect(response.data.error).to.be.true;
    });
    
    it('get message', async function () {
        const response = await axios.get(`/auth?uid=${user.address}`);
        nonce = response.data.nonce;
        expect(response.status, "status should be OK").to.equal(200);
        expect(response.data.nonce).to.have.lengthOf.above(2);
    });
    
    it('get token', async function(){
        let message = getMessage(user.address, nonce, 100);
        const signature = await user.signMessage(message.prepareMessage());
        const response = await axios.post(`/auth`,{signature, message}).catch(e=>e.response);
        token = response.data.token;
        expect(response.status, "status should be OK").to.equal(200);
        expect(response.data.token).to.have.lengthOf.above(5);
        expect(response.data.uid).to.equal(user.address);
    });

    it('profile empty', async function(){
        const response = await axios.get(`/user/info/${user.address}`);
        expect(response.data).to.be.empty;
    });

    it('update profile ', async function(){
        const userName = "John Shamana";
        const response = await axios.post(`/user/update`,{userName}, {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }).catch(e=>e.response);
        expect(response.status).to.equal(200);
        expect(response.data.userName).to.equal(userName);
        expect(response.data.uid).to.equal(user.address);
    });
    
    it('profile not empty', async function(){
        const response = await axios.get(`/user/info/${user.address}`);
        expect(response.data).to.not.be.empty;
        expect(response.data.uid).to.equal(user.address);
    });
});