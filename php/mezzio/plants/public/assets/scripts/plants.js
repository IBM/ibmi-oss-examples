app = window.app || {};
app.plants = app.plants || {};

app.plants.init = () => {
    const dataTable = app.plants.startTable();
    app.plants.setupModals(dataTable);
};

app.plants.startTable = () => {
    const tablePlants = $('#TablePlants').DataTable({
        ajax: {
            url: '/api/plants?all',
            dataSrc: '_embedded.plants'
        },
        order: [[1, 'desc']],
        columns: [
            {
                searchable: false,
                sortable: false,
                data: (plant) => {
                    let actions = '';

                    if (plant.hasOwnProperty('id')) {
                        actions += `<button class="btn btn-primary btn-edit-plant" data-plant-id="${plant.id}" data-toggle="modal" data-target="#ModalSavePlant"><i class="fa fa-edit"></i></button> ` +
                            `<button class="btn btn-danger btn-delete-plant" data-plant-id="${plant.id}"><i class="fa fa-trash"></i></button> `
                    }

                    return actions;
                }
            },
            { data: 'id' },
            { data: 'name' },
            { data: 'nickname' },
            {
                data: (plant) => {
                    return plant.hasOwnProperty('wiki') ? `<a href="${plant.wiki}" target="_blank">${plant.wiki}</a>` : '';
                }
            }
        ]
    });

    tablePlants.on('draw.dt', () => {
        app.plants.bindTableActions(tablePlants);
    });

    return tablePlants;
};

app.plants.setupModals = (dataTable) => {
    const $modalSavePlant = $('#ModalSavePlant');
    $modalSavePlant.on('show.bs.modal', (element) => {
        const $modal = $(element.currentTarget);
        const $formLoading = $modal.find('.form-inputs-loading');
        const $formInputs = $modal.find('.form-inputs');
        const $button = $(element.relatedTarget);
        const plantId = $button.data('plant-id');

        if (plantId !== undefined) {
            // Edit mode
            $formLoading.removeClass('d-none');
            $formInputs.addClass('d-none');
            $modal.find('.modal-title').text(`Save Plant #${plantId}`);

            $.ajax({
                url: `/api/plants/${plantId}`,
                type: 'GET',
                success: (res) => {
                    $modal.find('#id').val(res.id);
                    $modal.find('#name').val(res.name);
                    $modal.find('#nickname').val(res.nickname);
                    $modal.find('#wiki').val(res.wiki);
                },
                complete: () => {
                    $formLoading.addClass('d-none');
                    $formInputs.removeClass('d-none');
                }
            })
        }
    });

    $modalSavePlant.on('hidden.bs.modal', (element) => {
        const $modal = $(element.currentTarget);
        $modal.find('.modal-title').text(`Save New Plant`);
        $modal.find('#id').val(0);
        $modal.find('#name').val('');
        $modal.find('#nickname').val('');
        $modal.find('#wiki').val('');
    });

    $('#FormSavePlant').on('submit', (element) => {
        element.preventDefault();
        const $form = $(element.currentTarget);
        const inputValues = $form.serializeArray();
        const plant = {};
        let url = '/api/plants';

        for (let inputValue of inputValues) {
            plant[inputValue.name] = inputValue.value;
        }
        plant.id = parseInt(plant.id);
        const isNew = plant.id === 0;

        if (!isNew) {
            url += `/${plant.id}`;
        }

        $.ajax({
            url,
            type: 'POST',
            data: plant,
            success: (res) => {
                dataTable.ajax.reload(null, isNew);
                $modalSavePlant.modal('hide');
                app.genericSuccess('Success!', 'Plant record successfully saved.');
            },
            error: (res) => {
                let title = 'Error!';
                let message = 'Something went wrong while trying to save the plant record.';

                if (res.hasOwnProperty('responseJSON')) {
                    title = res.responseJSON.title;
                    message = res.responseJSON.detail;
                }

                $modalSavePlant.modal('hide');
                app.genericError(title, message);
            }
        });
    });
};

app.plants.bindTableActions = (dataTable) => {
    $('.btn-delete-plant').on('click', (element) => {
        const $button = $(element.currentTarget);
        const plantId = $button.data('plant-id');

        Swal.fire({
            title: 'Are you sure?',
            text: 'Deleting a plant cannot be undone.',
            buttonsStyling: false,
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            customClass: {
                confirmButton: 'btn btn-primary mr-3',
                cancelButton: 'btn btn-danger',
            },
        }).then((res) => {
            if (res.isConfirmed) {
                $.ajax({
                    url: `/api/plants/${plantId}`,
                    type: 'DELETE',
                    success: () => {
                        dataTable.ajax.reload(null, false);
                        app.genericSuccess('Success!', 'Plant record successfully deleted.');
                    },
                    error: (res) => {
                        let title = 'Error!';
                        let message = 'Something went wrong while trying to delete the plant record.';

                        if (res.hasOwnProperty('responseJSON')) {
                            title = res.responseJSON.title;
                            message = res.responseJSON.detail;
                        }

                        app.genericError(title, message);
                    }
                });
            }
        });
    });
};

$(() => {
    app.plants.init();
});