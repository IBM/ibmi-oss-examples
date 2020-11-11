const clients = require('restify-clients');

const client = clients.createJsonClient({
    url: 'http://localhost:3030'
});

let token = null;

// Unfortunately, promises aren't supported, so we have to nest callbacks
// For now, our client will pass in the correct credentials (see the user we
// create in db.js for this example)
client.post('/auth/', { username: 'Mark', password: 'My@Password12345!' }, function(err, req, res, obj) {

  if (err) {
    console.error(err);
    return;
  }

  // The /auth/ endpoint will return a JWT, which we need to add to our options
  // and pass to every subsequent API call. These APIs will only work when
  // a valid JWT is given. Notice also our path is defined here
  token = obj.token;

  let options = {
    path: '/books/',
    headers: {
      'Authorization': "Jwt " + token
    }
  }

  // have the client POST to /books/ with our new object. See routes.js for
  // implementation
  client.post(options, { title: "How to Develop Node.js", author: "Mark Irish" }, function(err, req, res, obj) {

    if (err) {
      console.error(err);
      return;
    }

    // Again, call endpoint /books/{id} with our JWT in the header
    let options = {
      path: `/books/${obj.id}`,
      headers: {
        'Authorization': "Jwt " + token
      }
    }

    // Get our newly added added book, and print it out showing our REST API is
    // working!
    client.get(options, function(err, req, res, obj) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(res.body);
    });
  });
});