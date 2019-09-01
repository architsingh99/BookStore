// For status change //
function statusChangeFunction(type, element) {

    swal({
        title: "Are you sure?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes,change it!",
        cancelButtonText: "No, cancel please!",

    }).then(function () {
        statusModifier(type, element);
    }, function (dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        if (dismiss === 'cancel') {
            swal(
                'Cancelled',
                'Your data is safe :)',
                'error'
            )
        }
    }).catch(swal.noop);
}

