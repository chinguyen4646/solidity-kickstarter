const routes = require('next-routes')();

routes
  .add('/campaigns/new', '/campaigns/new') // has to be before the dynamic route
  .add('/campaigns/:campaignAddress', '/campaigns/show')
  .add('/campaigns/:campaignAddress/requests', '/campaigns/requests/index')
  .add('/campaigns/:campaignAddress/requests/new', '/campaigns/requests/new');

module.exports = routes;
