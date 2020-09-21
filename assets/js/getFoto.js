(async () => {
    let response = await fetch('file_out_foto.txt');
    let dat = await response.json();
    console.log(dat);
    let src = "data:image/png;base64," + btoa(String.fromCharCode.apply(null, new Uint8Array(dat['Image']['array']))) ;
    let foto = '<div class="card mb-3">' +
        '<div class="row no-gutters">' +
        '<div class="col-md-5">' +
        '<img class="car rounded" src="' + src + '" width="100%">' +
        '</div>' +
        '<div class="col-md-7">' +
        '<div class="card-body">' +
        '<h5 class="card-title">'+dat['Time']['array'][0]+'</h5>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    $('#fotolog').html(foto + foto + foto);

    $('car').on('click', function () {

    })
})();