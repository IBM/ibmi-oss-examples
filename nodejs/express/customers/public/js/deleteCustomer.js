/* eslint-disable no-loop-func */
/* eslint-disable no-undef */

const self = this;

document.addEventListener('DOMContentLoaded', () => {
  const deleteLinks = document.getElementsByClassName('delete-link');

  function clickHandler() {
    axios.delete(`/api/customers/${this.id}/delete`).then(() => {
      // passing true forces reload from the server rather than cache
      self.location.reload(true);
    }).catch((error) => {
      console.log('axios something went wrong');
      console.error(error);
    });
  }

  for (let i = 0; i < deleteLinks.length; i += 1) {
    deleteLinks[i].addEventListener('click', clickHandler);
  }
});
