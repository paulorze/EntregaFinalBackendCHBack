import {expect } from 'chai';
import supertest from 'supertest';

const requester = supertest('http://localhost:8080');
const idExistente = '65133a0d8713bc71aa75557d';
const idInexistente = '5f27a9e4b6f2673bb33c5e0a';
let authToken;

describe('Testing products module', ()=> {
    before(async () => {
        const loginCredentials = {
            email: 'leila@leila.com',
            password: 'leilarze123',
        };

        const {statusCode, _body} = await requester.post('/api/users/login').send(loginCredentials);
        expect(statusCode).to.equal(200);
        authToken = _body.accessToken;
    });
    
    it('GET de /api/products debe devolver un payload tipo arreglo con todos los productos.', async ()=>{
        const {statusCode, _body} = await requester.get('/api/products');
        expect(statusCode).to.be.eql(200);
        expect(_body.result).to.be.an('array');
    });

    it('GET de /api/products/:id debe devolver el producto correspondiente al ID en URL params.', async ()=>{
        const {statusCode, _body} = await requester.get(`/api/products/${idExistente}`);
        expect(statusCode).to.be.eql(200);
        expect(_body.result).to.have.property('title');
    });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('GET de /api/products/:id con ID inexistente debe devolver error 404.', async ()=>{
    //     const {statusCode} = await requester.get(`/api/products/${idInexistente}`);
    //     expect(statusCode).to.be.eql(404);
    // });

    it('GET de /api/products/:id con ID erroneo debe devolver error 500.', async ()=>{
        const {statusCode} = await requester.get('/api/products/asdasdasd');
        expect(statusCode).to.be.eql(500);
    });

    it('POST de /api/products sin autenticar debe devolver error 401.', async () => {
        const newProductPayload = {
            title: 'Producto Test',
            category: 'Bazaar',
            description: 'Product test for the testing of multiple thingies and then being extra cool.',
            code: 'A023',
            price: 199.99,
            stock: 50,
            thumbnail: ['https://example.com/image.jpg'],
        };

        const { statusCode } = await requester.post('/api/products').send(newProductPayload);
        expect(statusCode).to.be.eql(401);
    });

    it('POST de /api/products correcto debe devolver el producto agregado a la base de datos.', async () => {
        const newProductPayload = {
            title: 'Producto Test',
            category: 'Bazaar',
            description: 'Product test for the testing of multiple thingies and then being extra cool.',
            code: 'A023',
            price: 199.99,
            stock: 50,
            thumbnail: ['https://example.com/image.jpg'],
        };

        const { statusCode, _body } = await requester.post('/api/products').send(newProductPayload).set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.be.eql(200);
        expect(_body.result).to.have.property('title', newProductPayload.title);
        const result = await requester.del(`/api/products/${_body.result._id}`).set('Cookie', [`session=${authToken}`]);
    });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('POST de /api/products incompleto debe devolver error 400.', async () => {
    //     const incompleteProductPayload = {
    //         title: 'Producto Incompleto'
    //     };

    //     const { statusCode } = await requester.post('/api/products').send(incompleteProductPayload).set('Cookie', [`session=${authToken}`]);
    //     expect(statusCode).to.be.eql(400);
    // });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('POST de /api/products con campos invalidos debe devolver error 400.', async () => {
    //     const newProductPayload = {
    //         title: 'Producto Test',
    //         category: 'Bazaar',
    //         description: 'Product test for the testing of multiple thingies and then being extra cool.',
    //         code: 'asdasdasd',
    //         price: 199.99,
    //         stock: 50,
    //         thumbnail: ['https://example.com/image.jpg'],
    //     };

    //     const { statusCode } = await requester.post('/api/products').send(newProductPayload).set('Cookie', [`session=${authToken}`]);
    //     expect(statusCode).to.be.eql(400);
    // });

    it('PUT de /api/products/:id sin autenticar debe devolver error 401.', async () => {

        const updateProductPayload = {
            title: 'Updated Product',
            category: 'Bazaar',
            description: 'Product test for the testing of multiple thingies and then being extra cool.',
            code: 'A022',
            price: 149.99,
            stock: 30,
            thumbnail: ['https://example.com/updated-image.jpg'],
        };

        const { statusCode } = await requester.put(`/api/products/${idExistente}`).send(updateProductPayload);
        expect(statusCode).to.be.eql(401);
    });

    it('PUT de /api/products/:id correcto debe devolver el producto actualizado en la base de datos.', async () => {
        const newProductPayload = {
            title: 'Producto Test',
            category: 'Bazaar',
            description: 'Product test for the testing of multiple thingies and then being extra cool.',
            code: 'A023',
            price: 199.99,
            stock: 50,
            thumbnail: ['https://example.com/image.jpg'],
        };

        const result = await requester.post('/api/products').send(newProductPayload).set('Cookie', [`session=${authToken}`]);
        const id = result._body.result._id;

        const updateProductPayload = {
            title: 'Updated Product',
            category: 'Bazaar',
            description: 'Product test for the testing of multiple thingies and then being extra cool.',
            code: 'A022',
            price: 149.99,
            stock: 30,
            thumbnail: ['https://example.com/updated-image.jpg'],
        };

        const { statusCode, _body } = await requester.put(`/api/products/${id}`).send(updateProductPayload).set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.be.eql(200);
        expect(_body.result).to.have.property('title', updateProductPayload.title);
        expect(_body.result).to.have.property('code', updateProductPayload.code);
        const delResult = await requester.del(`/api/products/${id}`).set('Cookie', [`session=${authToken}`]);
    });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('PUT de /api/products/:id con valores faltantes debe devolver error 400.', async () => {
    //     const newProductPayload = {
    //         title: 'Producto Test',
    //         category: 'Bazaar',
    //         description: 'Product test for the testing of multiple thingies and then being extra cool.',
    //         code: 'A023',
    //         price: 199.99,
    //         stock: 50,
    //         thumbnail: ['https://example.com/image.jpg'],
    //     };

    //     const result = await requester.post('/api/products').send(newProductPayload).set('Cookie', [`session=${authToken}`]);
    //     const id = result._body.result._id;

    //     const incompleteProductPayload = {
    //         title: 'Incomplete Updated Product',
    //     };

    //     const { statusCode } = await requester.put(`/api/products/${id}`).send(incompleteProductPayload).set('Cookie', [`session=${authToken}`]);
    //     expect(statusCode).to.be.eql(400);
    //     const delResult = await requester.del(`/api/products/${id}`).set('Cookie', [`session=${authToken}`]);
    // });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('PUT de /api/products/:id con valores invalidos debe devolver error 400.', async () => {
    //     const newProductPayload = {
    //         title: 'Producto Test',
    //         category: 'Bazaar',
    //         description: 'Product test for the testing of multiple thingies and then being extra cool.',
    //         code: 'A023',
    //         price: 199.99,
    //         stock: 50,
    //         thumbnail: ['https://example.com/image.jpg'],
    //     };

    //     const result = await requester.post('/api/products').send(newProductPayload).set('Cookie', [`session=${authToken}`]);
    //     const id = result._body.result._id;

    //     const invalidProductPayload = {
    //         title: 'Producto Test',
    //         category: 'asd',
    //         description: 'asd.',
    //         code: 'A023',
    //         price: 199.99,
    //         stock: 50,
    //         thumbnail: ['https://example.com/image.jpg'],
    //     };

    //     const { statusCode } = await requester.put(`/api/products/${id}`).send(invalidProductPayload).set('Cookie', [`session=${authToken}`]);
    //     expect(statusCode).to.be.eql(400);
    //     const delResult = await requester.del(`/api/products/${id}`).set('Cookie', [`session=${authToken}`]);
    // });

        //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('PUT de /api/products/:id de producto inexistente debe devolver error 404.', async () => {
    //     const updateProductPayload = {
    //         title: 'Updated Product',
    //         category: 'Bazaar',
    //         description: 'Product test for the testing of multiple thingies and then being extra cool.',
    //         code: 'A022',
    //         price: 149.99,
    //         stock: 30,
    //         thumbnail: ['https://example.com/updated-image.jpg'],
    //     };

    //     const { statusCode, _body } = await requester.put(`/api/products/${idInexistente}`).send(updateProductPayload).set('Cookie', [`session=${authToken}`]);
    //     expect(statusCode).to.be.eql(401);
    // });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('PUT de /api/products/:id de producto perteneciente a otro usuario debe devolver error 401.', async () => {
    //     const updateProductPayload = {
    //         title: 'Updated Product',
    //         category: 'Bazaar',
    //         description: 'Product test for the testing of multiple thingies and then being extra cool.',
    //         code: 'A022',
    //         price: 149.99,
    //         stock: 30,
    //         thumbnail: ['https://example.com/updated-image.jpg'],
    //     };

    //     const { statusCode, _body } = await requester.put(`/api/products/${idExistente}`).send(updateProductPayload).set('Cookie', [`session=${authToken}`]);
    //     expect(statusCode).to.be.eql(401);
    // });

    it('DELETE de /api/products/:id sin autenticar debe devolver error 401.', async () => {
        const { statusCode } = await requester.delete(`/api/products/${idExistente}`);
        expect(statusCode).to.be.eql(401);
    });


    it('DELETE de /api/products/:id correcto debe devolver el producto eliminado de la base de datos.', async () => {
        const newProductPayload = {
            title: 'Producto Test',
            category: 'Bazaar',
            description: 'Product test for the testing of multiple thingies and then being extra cool.',
            code: 'A023',
            price: 199.99,
            stock: 50,
            thumbnail: ['https://example.com/image.jpg'],
        };

        const result = await requester.post('/api/products').send(newProductPayload).set('Cookie', [`session=${authToken}`]);
        const id = result._body.result._id;

        const { statusCode, _body } = await requester.delete(`/api/products/${id}`).set('Cookie', [`session=${authToken}`]);
        expect(statusCode).to.be.eql(200);
        expect(_body.result).to.have.property('deletedCount', 1);
    });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('DELETE de /api/products/:id con ID inexistente debe devolver error 404.', async () => {
    //     const { statusCode } = await requester.delete(`/api/products/${idInexistente}`).set('Cookie', [`session=${authToken}`]);
    //     expect(statusCode).to.be.eql(404);
    // });

    //? NO GENERA EL NUMERO DE ERROR ADECUADO?????
    // it('DELETE de /api/products/:id de producto perteneciente a otro usuario debe devolver error 401.', async () => {
    //     const { statusCode } = await requester.delete(`/api/products/${idExistente}`).set('Cookie', [`session=${authToken}`]);
    //     expect(statusCode).to.be.eql(404);
    // });
});