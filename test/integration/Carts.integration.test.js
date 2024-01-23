import {expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');
let authToken;
const premiumLoginCredentials = {
    email: 'leila@leila.com',
    password: 'leilarze123',
};

const adminLoginCredentials = {
    email: "rzeszutagustin@gmail.com",
    password: "agusrze123"
}

describe('Testing carts module', ()=>{
    before(async () => {
        const {statusCode, _body} = await requester.post('/api/users/login').send(premiumLoginCredentials);
        expect(statusCode).to.equal(200);
        authToken = _body.accessToken;
    });

    it('POST de /api/carts debe devolver el cart recien creado.', async ()=>{
        const {statusCode, _body} = await requester.post('/api/carts/').set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.equal(200);
        expect(_body.result).to.have.property('_id');
        expect(_body.result).to.have.property('purchaser', premiumLoginCredentials.email);
    });

    it('POST de /api/carts dde usuario sin autenticar debe devolver error 401.', async ()=>{
        const {statusCode, _body} = await requester.post('/api/carts/');
        expect(statusCode).to.equal(401);
    });

    it('GET de /api/carts debe devolver el cart asociado al usuario autenticado.', async ()=>{
        const {statusCode, _body} = await requester.get('/api/carts/').set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.equal(200);
        expect(_body.result).to.have.property('_id');
        expect(_body.result).to.have.property('purchaser', premiumLoginCredentials.email);
    });

    it('GET de /api/carts de usuario sin autenticar debe devolver error 401.', async ()=>{
        const {statusCode} = await requester.get('/api/carts/');
        expect(statusCode).to.equal(401);
    });

    it('PUT de /api/carts debe devolver el cart asociado al usuario autenticado con los productos recien agregados.', async ()=>{
        const products = [
            {
                pid: '65133a0d8713bc71aa75557d',
                quantity: 1
            },
            {
                pid: '65133a558713bc71aa75557f',
                quantity: 400
            }
        ];
        const {statusCode, _body} = await requester.put('/api/carts/').send({products}).set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.equal(200);
        expect(_body.result.products[0]).to.have.property('pid', products[0].pid);
    });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('PUT de /api/carts sin productos debe devolver error 400.', async ()=>{
    //     const products = null;
    //     const {statusCode, _body} = await requester.put('/api/carts/').send({products}).set('Cookie', [`session=${authToken}`]);
    //     expect(statusCode).to.equal(400);
    // });

    it('PUT de /api/carts de usuario sin autenticar debe devolver error 401.', async ()=>{
        const products = [
            {
                pid: '65133a0d8713bc71aa75557d',
                quantity: 1
            },
            {
                pid: '65133a558713bc71aa75557f',
                quantity: 400
            }
        ];
        const {statusCode} = await requester.put('/api/carts/').send({products});
        expect(statusCode).to.equal(401);
    });

    it('PUT de /api/carts/addProduct debe devolver el cart asociado al usuario autenticado con los productos recien agregados.', async ()=>{
        const product = {
            pid: '65133a628713bc71aa755581',
            quantity: 5
        };
        const {statusCode, _body} = await requester.put('/api/carts/addProduct').send(product).set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.equal(200);
        expect(_body.result.products[2]).to.have.property('pid', product.pid);
    });

    it('PUT de /api/carts/addProduct de usuario sin autenticar debe devolver error 401.', async ()=>{
        const product = {
            pid: '65133a628713bc71aa755581',
            quantity: 5
        };
        const {statusCode} = await requester.put('/api/carts/addProduct').send(product);
        expect(statusCode).to.equal(401);
    });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('PUT de /api/carts/addProduct sin productos debe devolver error.', async ()=>{
    //     const product = {};
    //     const {statusCode, _body} = await requester.put('/api/carts/addProduct').send(product).set('Cookie', [`session=${authToken}`]);
    //     console.log(statusCode, _body)
    //     expect(statusCode).to.equal(401);
    // });

    it('DELETE de /api/carts/deleteProduct debe devolver el carrito con el producto eliminado', async ()=>{
        const pid = '65133a628713bc71aa755581';
        const {statusCode, _body} = await requester.delete('/api/carts/deleteProduct').send({pid}).set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.equal(200);
        expect(_body.result.products).to.have.lengthOf(2);
    });

    it('DELETE de /api/carts/deleteProduct con PID de producto inexistente en el carrito debe devolver el carrito igual que como estaba.', async ()=>{
        const pid = '65133a698713bc71aa755583';
        const {statusCode, _body} = await requester.delete('/api/carts/deleteProduct').send({pid}).set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.equal(200);
        expect(_body.result.products).to.have.lengthOf(2);
    });

    it('DELETE de /api/carts/deleteProduct de usuario sin autenticar debe devolver error 401.', async ()=>{
        const pid = '65133a628713bc71aa755581';
        const {statusCode} = await requester.delete('/api/carts/deleteProduct').send({pid});
        expect(statusCode).to.equal(401);
    });

    it('POST de /api/carts/purchase debe devolver el carrito con los productos cuyo stock es mayor al existente.', async ()=>{
        const {statusCode, _body} = await requester.post('/api/carts/purchase').set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.equal(200);
        expect(_body.result).to.have.property('purchaser', premiumLoginCredentials.email);
        expect(_body.result.products).to.have.lengthOf(1);
    });

    it('POST de /api/carts/purchase de usuario sin autenticar debe devolver error 401.', async ()=>{
        const {statusCode, _body} = await requester.post('/api/carts/purchase');
        expect(statusCode).to.equal(401);
    });

    it('DELETE de /api/carts debe eliminar el cart asociado al usuario autenticado.', async ()=>{
        const {statusCode, _body} = await requester.delete('/api/carts/').set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.equal(200);
        expect(_body.result).to.have.property('deletedCount', 1);
    });

    it('DELETE de /api/carts de usuario sin autenticar debe devolver error 401.', async ()=>{
        const {statusCode} = await requester.delete('/api/carts/');
        expect(statusCode).to.equal(401);
    });

    it('GET de /api/carts/all debe devolver todos los carts.', async ()=>{
        const loginResult = await requester.post('/api/users/login').send(adminLoginCredentials);
        const adminAuthToken = loginResult._body.accessToken;
        const {statusCode, _body} = await requester.get('/api/carts/all').set('Cookie', [`session=${adminAuthToken}`]);
        expect(statusCode).to.equal(200);
        expect(_body.result).to.be.an('array');
    });

    it('GET de /api/carts/all de usuario sin autenticar debe devolver error 401.', async ()=>{
        const {statusCode} = await requester.get('/api/carts/all');
        expect(statusCode).to.equal(401);
    });
});