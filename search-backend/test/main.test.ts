//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/main';

chai.use(chaiHttp);

describe('api-test', () => {
    describe('/first api', () => {
        it('it show return message ==> ', async () => {
            let res = await chai.request(server)
                .get('/api').send();
            // .end((err, res) => {
            //     console.log(res.body)
            //     // res.should.have.status(200);
            //     // res.body.should.be.a('array');
            //     // res.body.length.should.be.eql(0);
            // });

            console.log("await", res.body)
        });
        // it('it show return message ==> ', (done) => {
        //     chai.request(server)
        //         .get('/api')
        
        //         .end((err, res) => {
            
        //             console.log(res.body)
        //             // res.should.have.status(200);
        //             // res.body.should.be.a('array');
        //             // res.body.length.should.be.eql(0);
        //             done();
        //         });
        // });
    });
})