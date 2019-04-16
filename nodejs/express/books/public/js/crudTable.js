//Shows The Add Book Form
$('#openAddBookModal').on('click', function () {
  $('#addBook-modal').modal({
    show: true
  });
});

//Makes HTTP POST REQUEST To Add the Book
$('#submitAddBookBtn').on('click', function addBook(e) {
  e.preventDefault();
  //intialize and sanitize the data
  let title = $('#titleInput').val().trim(),
    isbn = $('#isbnInput').val().trim(),
    amount = parseFloat( $('#amountInput').val() ).toFixed(2),
    //object to send with the POST REQUEST
    data = {
      title: title,
      isbn: isbn,
      amount: amount
    };
  console.log(`title ${title} , isbn ${isbn} , amount ${amount}`);
  $.ajax({
    url: `/addBook`,
    type: 'POST',
    data: data,
    success: function (response) {
      if (response) {
        console.log(`Add Success: ${response}`);
      } else {
        console.log(`Add Fail: ${response}`);
      }
      location.reload();
    },
    error: function (err) {
      console.log(`AJAX Failed: ${err.status}\n`);
      $('#errorAlert').html('<strong>Failed to add new book</strong>');
      $('#errorAlert').show();
      $('#addBook-modal').modal('hide');
      $('#infoAlert').hide();
    }
  });
});

//Coverts the Text Nodes to Editable Input Fields
$('.glyphicon-pencil').on('click', function () {
  //parse the id from the id attribute of the span holding gly-pencil
  let me = this,
    cut = new RegExp(/-(\d+)/).exec(me.id),
    id = cut[1];

    // get a reference to the current values of Text Nodes
  let isbnVal = $(`#isbn-${id}`).text().trim(),
    titleVal = $(`#title-${id}`).text().trim(),
    amountVal = parseFloat( $(`#amount-${id}`).text() ).toFixed(2);

  console.log(`ISBN: ${isbnVal}, \nTitle: ${titleVal}, \nAmount : ${amountVal}`);
  //hide the pencil and trash icon & show the floppy disk icon
  $(`#edit-${id}`).hide();
  $(`#del-${id}`).hide();
  $(`#save-${id}`).show();
  //create input dialoags and populate with the current values
  $(`#title-${id}`).html(`<input type="text" id="titleInput-${id}" value ="${titleVal}" />`);
  $(`#isbn-${id}`).html(`<input type="number" id ="isbnInput-${id}" value = "${isbnVal}"/>`);
  $(`#amount-${id}`).html(`<input type="number" id= "amountInput-${id}" value = "${amountVal}"/>`);
});

//Updates the Book Fields and Returns Fields Back To Text Nodes
$('.glyphicon-floppy-disk').on('click', function(){
  //parse the id from the id attribute
  let cut = new RegExp(/-(\d+)/).exec(this.id),
    id = cut[1],
    titleVal = $(`#titleInput-${id}`).val().trim(),
    isbnVal = $(`#isbnInput-${id}`).val().trim(),
    amountVal = $(`#amountInput-${id}`).val();

  amountVal = parseFloat(amountVal).toFixed(2);

  console.log(`ISBN: ${isbnVal}, \nTitle: ${titleVal}, \nAmount : ${amountVal}`);

  //save the changes to the database through ajax HTTP PUT REQUEST
  let data = {
    id: id,
    title: titleVal,
    isbn: isbnVal,
    amount: amountVal
  };

  $.ajax({
    url: '/updateBook',
    type: 'PUT',
    data: data,
    success: function (response) {
      if (response) {
        console.log(`Update Success: ${response}`);
      } else {
        console.log(`Update Fail: ${response}`);
      }
      location.reload();
    },
    error: function (err) {
      console.log(`AJAX Failed: ${err.status}\n`);
      $('#errorAlert').html('<strong>Failed to update book</strong>');
      $('#errorAlert').show();
      $('#infoAlert').hide();
    }
  });

  //set the Elements Back to Text Nodes
  $(`#title-${id}`).html(titleVal);
  $(`#isbn-${id}`).html(isbnVal);
  $(`#amount-${id}`).html(amountVal);
  $(`#save-${id}`).hide();
  $(`#edit-${id}`).show();
  $(`#del-${id}`).show();
});


//Gets and Sets ID of the book to be deleted and opens confirm dialog
$('.glyphicon-trash').on('click', function () {
  let me = this,
    cut = new RegExp(/-(\d+)/).exec(me.id),
    id = cut[1];

  $.get(`/getbook/${id}`, function (data, status) {
    console.log(`Data: ${JSON.stringify(data)} \nStatus: ${status}`);
    if (status === 'success') {
      let bookid = data.BOOKID,
        msg = `Confirm Delete: ${data.TITLE}`;
      console.log(data.BOOKID);
      $('#deleteBookBtn').attr('name', bookid);
      $('#deleteH1').html(msg);
      $('#deleteBook-modal').modal({
        show: true
      });
    }
  });
});

//Makes HTTP DELETE Request to the Server to remove Book
$('#deleteBookBtn').on('click', function deleteBook(e) {
  e.preventDefault;
  console.log(`ID was: ${this.name}`);
  let id = this.name;
  $.ajax({
    url: `/deletebook/${id}`,
    type: 'DELETE',
    success: function (response) {
      console.log(`Delete Success: ${response}`);
      location.reload();
    },
    error: function (err) {
      console.log(`AJAX Failed: ${err.status}\n`);
      $('#errorAlert').html('<strong>Failed to delete book</strong>');
      $('#errorAlert').show();
      $('#deleteBook-modal').modal('hide');
      $('#infoAlert').hide();
    }
  });
});
