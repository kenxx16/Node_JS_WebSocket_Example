
(async () => {
    let response = await fetch('file_out (6).txt');
    let dat = await response.json();
    let text = [];
    let i = 0;
    let s = 1;

    dat['Frequencies']['array'].forEach(function(entry) {
        text.push([entry, s, dat['Amplitudes']['array'][i]]);
        i++;
    });
    i = 0;
    let time = dat['Time']['array'][0];
    let out =  '';
    let direction = '', presence = '', CentralFrequency = '', Span = '', ModulationType = '';
    // console.log(time);

    $('#time').text(dat['Time']['array'][0]);

    switch (dat['Direction']['array'][0]) {
        case 0:{
            direction = '<p>Направление: не определено</p>';
            break;
        }
        case 1:{
            direction = '<p>Направление: слева (на комплекс)</p>';
            break;
        }
        case 2:{
            direction = '<p>Направление: справа (от комплекса)</p>';
            break;
        }
    }

    switch (dat['Presence']['array'][0]) {
        case 0:{
            presence = '<p>Наличие помехи: нет</p>';
            break;
        }
        case 1:{
            presence = '<p>Наличие помехи: есть</p>';
            break;
        }
    }

    if (dat['CentralFrequency']['array'][0]) {
        CentralFrequency = '<p>Центральная частота: ' + dat['CentralFrequency']['array'][0]/1000000 + ' МГц</p>';
    }

    if (dat['Span']['array'][0]) {
        Span = '<p>Ширина полосы помехи: ' + dat['Span']['array'][0]/1000000 + ' МГц</p>';
    }

    if (dat['ModulationType']['array'][0]) {
        switch (dat['ModulationType']['array'][0]) {
            case 0: {
                ModulationType = '<p>Вид модуляции: не определено</p>>';
                break;
            }
            case 1: {
                ModulationType = '<p>Вид модуляции: без модуляции</p>';
                break;
            }
            case 2: {
                ModulationType = '<p>Вид модуляции: ЛЧМ</p>';
                break;
            }
        }
    }

    out = '<div class="row"><div class="col-6">' + direction + presence + CentralFrequency + '</div><div class="col-6">' + Span + ModulationType + '<p>' + time + '</p>' +
        '</div></div><hr>';
    $('#mess').html(out+out+out);


    setInterval(() => spec.series[0].update({
       boostThreshold: 100,
       data: text
    }), 5000);

    $('#minmax').on('click', function() {
        let minf = $('#minf').val();
        let maxf = $('#maxf').val();

        spec.xAxis[0].setExtremes(parseInt(minf), parseInt(maxf));
        spec.colorAxis[0].setExtremes(parseInt(minf), parseInt(maxf));
    });

    $('#adds').on('click', function () {

        i=0;
        s++;

        dat['Frequencies']['array'].forEach(function (entry) {
            text.push([entry, s, dat['Amplitudes']['array'][i]]);
            i++;
        });
	// console.log(s);
    //     console.log(spec);
    });




    let spec = new Highcharts.chart('specter', {


        chart: {
            type: 'heatmap',
            animation: false
        },

        boost: {
            useGPUTranslations: true,
            usePreallocated: true
        },

        title: {
            text: '_',
            align: 'left',
            x: 40
        },

        xAxis: {
            type: 'double',
            showLastLabel: false,
        },

        yAxis: {
            title: {
                text: null
            },
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false,
            min: 1,
            max: 20,
            reversed: true
        },

        colorAxis: {
            stops: [
                [0, '#3060cf'],
                [1, '#f95a0c'],
                [1, '#c4ae3a']
            ],
        },

        series: [{
            boostThreshold: 100,
            colsize: 100000,
            data: text
        }]

    });


})();
