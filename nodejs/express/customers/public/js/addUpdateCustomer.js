/* eslint-disable no-loop-func */
/* eslint-disable no-undef */

const self = this;

document.addEventListener('DOMContentLoaded', () => {
//   const submitBtn = document.getElementsById('form-submit-btn');
  const form = document.getElementById('customer-form');
  const method = form.attributes.method.textContent;

  function submitHandler(event) {
    event.preventDefault();

    if (!method) {
      throw new Error('Unable to determine method');
    }

    const CUSNUM = document.getElementById('CUSNUM').value;
    const LSTNAM = document.getElementById('LSTNAM').value;
    const INIT = document.getElementById('INIT').value;
    const STREET = document.getElementById('STREET').value;
    const CITY = document.getElementById('CITY').value;
    const STATE = document.getElementById('STATE').value;

    const data = {
      CUSNUM,
      LSTNAM,
      INIT,
      STREET,
      CITY,
      STATE,
    };

    if (method === 'PUT') {
      axios.put('/api/customers/update', data).then(() => {
        // passing true forces reload from the server rather than cache
        self.location = '/';
      }).catch((error) => {
        console.log('axios error with PUT request');
        console.error(error);
      });
    } else if (method === 'POST') {
      axios.post('/api/customers/create', data).then(() => {
        // passing true forces reload from the server rather than cache
        self.location = '/';
      }).catch((error) => {
        console.log('axios error with POST request');
        console.error(error);
      });
    }
  }

  form.addEventListener('submit', submitHandler);
});
