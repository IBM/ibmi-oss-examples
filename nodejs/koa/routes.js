const Router     = require('koa-router');
const router     = new Router();
const passport   = require('koa-passport');
const poolPromise  = require('./db').pool;

let pool;

// create an HTML template for the books that exist in the table.
// The books are cleared every time the server is started up
async function generateBooksTable() {

  // we know this is the first called, so put this here for now
  pool = await poolPromise;

  let tableHTML = '<table><tr><th>Title</th><th>Author</th></tr>';

  // get the books from the database
  const results = await pool.query("SELECT * FROM KOA_BOOKS");

  results.forEach(function(result) {
    tableHTML += "<tr><td>" + result["TITLE"] + "</td><td>" + result["AUTHOR"] + "</td></tr>";
  })

  tableHTML += '</table>'

  return tableHTML;
}

// query used to insert book values into our tables
async function insertBook(title, author) {
  await pool.query("INSERT INTO KOA_BOOKS(TITLE, AUTHOR) VALUES(?, ?)", [title, author]);
}

// The root view, which has a simple login form
router.get('/', async (ctx) => {
  ctx.type = 'html';
  ctx.body = `
  <form action="/login" method="post">
  <div class="container">
    <label for="username"><b>Username</b></label>
    <input type="text" placeholder="Enter Username" name="username" required>

    <label for="password"><b>Password</b></label>
    <input type="password" placeholder="Enter Password" name="password" required>

    <button type="submit">Login</button>
  </div>
</form>
  `;
});

// Our login route, that redirects depending on whether our credentials were
// valid;
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  })
)

// Log out of the session
router.get('/logout', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logout();
    ctx.redirect('/');
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
})

// Our dashboard route that displays all of the books in our table.
router.get('/app', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.type = 'html';
    ctx.body = `
      Welcome to your dashboard
      <form action="/books" method="post">
        <div class="container">
          <label for="title"><b>Title</b></label>
          <input type="text" placeholder="Book Title" name="title" required>

          <label for="author"><b>Author</b></label>
          <input type="text" placeholder="Author Name" name="author" required>

        <button type="submit">Add Book</button>
      </div>
    </form>`;
    ctx.body += await generateBooksTable();
    ctx.body +=  `<br><br><a href="/logout">LOGOUT</a>`
  } else {
    ctx.body = { success: false };
    ctx.throw(401);
  }
});

// POST /book
router.post('/books', async (ctx) => {
  const { title, author } = ctx.request.body;
  await insertBook(title, author);
  ctx.redirect('/app');
});


module.exports = router;
