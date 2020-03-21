import * as assert from 'assert';
import * as rp from 'request-promise'
import config from '../../src/config';
import responses from '../../src/constants/responses';

describe('auth test', (ctx = {}) => {


  it('should register new user', async () => {

    ctx.user = {
      username: `test${Date.now()}`,
      password: 'test',
      email: 'test@test.com'
    };

    const reply = await rp({
      uri: `http://localhost:${config.rest.port}/signup`,
      method: 'POST',
      json: ctx.user
    });

    assert(reply.status === responses.generic.success);
  });


  it('should login', async () => {

    const reply = await rp({
      uri: `http://localhost:${config.rest.port}/signin`,
      method: 'POST',
      json: {
        username: ctx.user.username,
        password: ctx.user.password
      }
    });

    assert(reply.access !== null && reply.refresh !== null);
    ctx.user.tokens = {
      access: reply.access,
      refresh: reply.refresh
    };
  });


  it('should validate', async () => {

    const reply = await rp({
      uri: `http://localhost:${config.rest.port}/validate`,
      method: 'POST',
      json: {
        token: ctx.user.tokens.access
      }
    });

    assert(reply.status === responses.generic.success);
  });

});
