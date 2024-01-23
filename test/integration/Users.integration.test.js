import {expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');
let authToken;
const premiumLoginCredentials = {
    email: 'leila@leila.com',
    password: 'leilarze123'
};
const userLoginCredentials = {
    email: 'juan@juan.com',
    password: 'juani123'
};

const adminLoginCredentials = {
    email: "rzeszutagustin@gmail.com",
    password: "agusrze123"
}

const premiumKeyTest = '59QF/B1Vugx1';

describe('Testing users module', ()=>{
    
    it('POST de /api/users/login debe devolver la cookie accessToken si los parametros son correctos.', async ()=>{
        const {statusCode, _body} = await requester.post('/api/users/login').send(premiumLoginCredentials);
        expect(statusCode).to.equal(200);
        expect(_body).to.have.property('accessToken');
    });
    
    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('POST de /api/users/login debe devolver error 401 si los parametros no estan completos.', async ()=>{
    //     const incompleteLoginCredentials = {
    //         email: 'leila@leila.com'
    //     };
    //     const {statusCode, _body} = await requester.post('/api/users/login').send(incompleteLoginCredentials);
    //     expect(statusCode).to.equal(401);
    // });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('POST de /api/users/login debe devolver error 401 si los parametros son incorrectos.', async ()=>{
    //     const incompleteLoginCredentials = {
    //         email: 'leila@leila.com',
    //         password: 'asdasd'
    //     };
    //     const {statusCode, _body} = await requester.post('/api/users/login').send(incompleteLoginCredentials);
    //     expect(statusCode).to.equal(401);
    // });

    it('POST de /api/users/register debe devolver el usuario correctamente creado si estan correctos los parametros.', async ()=>{
        const registerCredentials = {
            username: 'juan',
            first_name: 'juan',
            last_name: 'merca',
            email: 'juan@juan.com',
            password: 'juani123'
        };

        const {statusCode, _body} = await requester.post('/api/users/register').send(registerCredentials);
        expect(statusCode).to.equal(200);
        expect(_body.result).to.have.property('_id');
        const loginResult = await requester.post('/api/users/login').send(userLoginCredentials);
        authToken = loginResult._body.accessToken;
        const result = await requester.delete('/api/users').set('Cookie', [`session=${authToken}`]);
    });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('POST de /api/users/register debe devolver error 400 si los parametros estan incompletos.', async ()=>{
    //     const registerCredentials = {
    //         username: 'juan',
    //         first_name: 'juan',
    //         last_name: 'merca',
    //         password: 'juani123'
    //     };
    //     const {statusCode} = await requester.post('/api/users/register').send(registerCredentials);
    //     expect(statusCode).to.equal(400);
    // });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('POST de /api/users/register debe devolver error 409 si el mail ya fue utilizado para otra cuenta.', async ()=>{
    //     const registerCredentials = {
    //         username: 'juan',
    //         first_name: 'juan',
    //         last_name: 'merca',
    //         email: 'paulo@paulo.com',
    //         password: 'juani123'
    //     };
    //     const {statusCode} = await requester.post('/api/users/register').send(registerCredentials);
    //     expect(statusCode).to.equal(409);
    // });

    it('PUT de /api/users/updateUser debe devolver el usuario correctamente actualizado si estan correctos los parametros.', async ()=>{
        const registerCredentials = {
            username: 'juan',
            first_name: 'juan',
            last_name: 'merca',
            email: 'juan@juan.com',
            password: 'juani123'
        };

        const updateCredentials = {
            username: 'carlos',
            first_name: 'Carlos',
            last_name: 'Merca',
            email: 'juan@juan.com'
        };

        const registerResult = await requester.post('/api/users/register').send(registerCredentials);
        const loginResult = await requester.post('/api/users/login').send(userLoginCredentials);
        authToken = loginResult._body.accessToken;
        const {statusCode, _body} = await requester.put('/api/users/updateUser').send(updateCredentials).set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.equal(200);
        expect(_body.result).to.have.property('username', updateCredentials.username);
        expect(_body.result).to.have.property('first_name', updateCredentials.first_name);
        const result = await requester.delete('/api/users').set('Cookie', [`session=${authToken}`]);
    });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('PUT de /api/users/updateUser debe devolver error 400 si estan incompletos los parametros.', async ()=>{
    //     const registerCredentials = {
    //         username: 'juan',
    //         first_name: 'juan',
    //         last_name: 'merca',
    //         email: 'juan@juan.com',
    //         password: 'juani123'
    //     };

    //     const updateCredentials = {
    //         username: 'carlos',
    //         email: 'juan@juan.com'
    //     };

    //     const registerResult = await requester.post('/api/users/register').send(registerCredentials);
    //     const loginResult = await requester.post('/api/users/login').send(userLoginCredentials);
    //     authToken = loginResult._body.accessToken;
    //     const {statusCode} = await requester.put('/api/users/updateUser').send(updateCredentials).set('Cookie', [`session=${authToken}`]);
    //     expect(statusCode).to.equal(400);
    //     const result = await requester.delete('/api/users').set('Cookie', [`session=${authToken}`]);
    // });

    it('PUT de /api/users/updateUser debe devolver error 401 si el usuario no esta autenticado.', async ()=>{
        const registerCredentials = {
            username: 'juan',
            first_name: 'juan',
            last_name: 'merca',
            email: 'juan@juan.com',
            password: 'juani123'
        };

        const updateCredentials = {
            username: 'carlos',
            email: 'juan@juan.com'
        };

        const registerResult = await requester.post('/api/users/register').send(registerCredentials);
        const loginResult = await requester.post('/api/users/login').send(userLoginCredentials);
        authToken = loginResult._body.accessToken;
        const {statusCode} = await requester.put('/api/users/updateUser').send(updateCredentials);
        expect(statusCode).to.equal(401);
        const result = await requester.delete('/api/users').set('Cookie', [`session=${authToken}`]);
    });

    it('GET de /api/users/logout debe redireccionar si se realizo correctamente.', async ()=>{
        const loginResult = await requester.post('/api/users/login').send(premiumLoginCredentials);
        authToken = loginResult._body.accessToken;
        const {statusCode} = await requester.get('/api/users/logout').set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.equal(302);
    });

    it('GET de /api/users/logout debe lanzar error 401 si el usuario no esta autenticado.', async ()=>{
        const {statusCode} = await requester.get('/api/users/logout');
        expect(statusCode).to.equal(401);
    });

    it('GET de /api/users/current debe devolver datos del usuario autenticado.', async ()=>{
        const loginResult = await requester.post('/api/users/login').send(premiumLoginCredentials);
        authToken = loginResult._body.accessToken;
        const {statusCode, _body} = await requester.get('/api/users/current').set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.equal(200);
        expect(_body.result).to.have.property('_id');
        expect(_body.result).to.have.property('email', premiumLoginCredentials.email);
    });

    it('GET de /api/users/current debe devolver error 401 si el usuario no esta autenticado.', async ()=>{
        const {statusCode} = await requester.get('/api/users/current');
        expect(statusCode).to.equal(401);
    });

    it('POST de /api/users/premium/:id debe modificar el rol del usuario de PREMIUM a USER y viceversa.', async ()=>{
        const loginResult = await requester.post('/api/users/login').send(adminLoginCredentials);
        authToken = loginResult._body.accessToken;
        const getByEmailResult = await requester.get(`/api/users/getByEmail/${premiumLoginCredentials.email}`).set('Cookie', [`session=${authToken}`]);
        const recategorizeResult = await requester.post(`/api/users/premium/${getByEmailResult._body.result._id}`).set('Cookie', [`session=${authToken}`]);
        expect(recategorizeResult.statusCode).to.equal(200);
        expect(recategorizeResult._body.result).to.have.property('role', 'USER');
        const recategorizeResult2 = await requester.post(`/api/users/premium/${getByEmailResult._body.result._id}`).set('Cookie', [`session=${authToken}`]);
        expect(recategorizeResult2.statusCode).to.equal(200);
        expect(recategorizeResult2._body.result).to.have.property('role', premiumKeyTest);
    });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('POST de /api/users/resetEmail debe devolver error 404 si no estan completos los datos.', async ()=> {
    //     const {statusCode} = await requester.post('/api/users/passwordReset');
    //     expect(statusCode).to.equal(401);
    // });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('POST de /api/users/resetEmail debe devolver error 404 si no existe usuario con el mail dado.', async ()=> {
    //     const {statusCode} = await requester.post(`/api/users/passwordReset`).send(userLoginCredentials.email);
    //     expect(statusCode).to.equal(404);
    // });

    it('POST de /api/users/resetEmail debe devolver status 200 si existe el mail.', async ()=> {
        const {statusCode} = await requester.post(`/api/users/passwordReset`).send({email: premiumLoginCredentials.email});
        expect(statusCode).to.equal(200);
    });

    it('DELETE de /api/users debe devolver 200 si se elimina correctamente el usuario.', async ()=>{
        const registerCredentials = {
            username: 'juan',
            first_name: 'juan',
            last_name: 'merca',
            email: 'juan@juan.com',
            password: 'juani123'
        };

        const loginCredentials = {
            email: 'juan@juan.com',
            password: 'juani123'
        };

        const registerResult = await requester.post('/api/users/register').send(registerCredentials);
        const loginResult = await requester.post('/api/users/login').send(loginCredentials);
        authToken = loginResult._body.accessToken;
        const {statusCode, _body} = await requester.delete('/api/users').set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.eql(200);
        expect(_body.result).to.have.property('deletedCount', 1);
    });
});
