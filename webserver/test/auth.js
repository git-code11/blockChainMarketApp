const {expect} = require('chai');
const {Wallet} = require('ethers');
const _axios = require('axios');

const { wrapper } =  require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const jar = new CookieJar();

const baseURL = "http://localhost:4000";

const axios = wrapper(_axios.create({
    baseURL, jar
  }));

describe('Authentication', function () {
    let user;
    let msg;
    let token;

    before(function(){
        user = Wallet.createRandom();
    });

    it('get message', async function () {
        const response = await axios.get(`/auth/create/${user.address}`);
        msg = response.data.msg;
        expect(response.status, "status should be OK").to.equal(200);
        expect(response.data.msg).to.have.lengthOf.above(10);
    });

    it('send invalid signature', async function(){
        const signature = await user.signMessage(msg);
        const response = await axios.post(`/auth/verify`,{sig:signature+'2'}).catch(e=>e.response);
        expect(response.status, "status should be OK").to.equal(500);
        expect(response.data.error).to.be.true;
    });
    
    it('get message', async function () {
        const response = await axios.get(`/auth/create/${user.address}`);
        msg = response.data.msg;
        expect(response.status, "status should be OK").to.equal(200);
        expect(response.data.msg).to.have.lengthOf.above(10);
    });
    
    it('get token', async function(){
        const signature = await user.signMessage(msg);
        const response = await axios.post(`/auth/verify`,{sig:signature});
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
        expect(response.data.info.userName).to.equal(userName);
        expect(response.data.info.uid).to.equal(user.address);
    });
    
    it('profile not empty', async function(){
        const response = await axios.get(`/user/info/${user.address}`);
        expect(response.data).to.not.be.empty;
        expect(response.data.info.uid).to.equal(user.address);
    });

    

});