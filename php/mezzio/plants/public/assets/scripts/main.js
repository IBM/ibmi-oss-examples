app = window.app || {};

app.genericError = (title, message) => {
    Swal.fire({
        icon: 'error',
        title,
        text: message
    });
};

app.genericSuccess = (title, message) => {
    Swal.fire({
        icon: 'success',
        title,
        text: message
    });
};