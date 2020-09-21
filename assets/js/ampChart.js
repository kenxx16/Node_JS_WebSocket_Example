
(async () => {

    let s = 1;
    let dat = {};
    let chartArr = [];
    let text = [];
    let chartColor = '#007bff';

    var socket = new WebSocket("ws://localhost:3000/data");

    socket.onmessage = function (event) {
        chartArr = [];
        let incomingMessage = event.data;
        dat = JSON.parse(incomingMessage);
        // console.log(dat);
        let i = 0;

        dat['Frequencies']['array'].forEach(function(entry) {
            chartArr[i] = [entry, dat['Amplitudes']['array'][i]];
            i++;
        });

        switch (dat['Presence']['array'][0]) {
            case 0:{
                chartColor = 'rgb(99, 44, 232)';
                break;
            }
            case 1:{
                chartColor = 'rgb(189, 27, 5)';
                break;
            }
        }

        ampChart.series[0].update({
            boostThreshold: 100,
            data: chartArr,
            color: chartColor
        })

        //-----------------------------------------------------

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

        //-----------------------------------------------------
        s++;
        i = 0;
        // text = [];
        dat['Frequencies']['array'].forEach(function(entry) {
            // spec.series[0].addPoint([entry, s, dat['Amplitudes']['array'][i]]);
            text.push([entry, s, dat['Amplitudes']['array'][i]]);

            i++;
        });
        // console.log(text);
        // spec.series[0].addPoint({
        //     boostThreshold: 100,
        //     data: text
        // })
        console.log(spec);
    };

    //---------------------------------------------------------

    let ampChart = new Highcharts.chart('ampChart', {

        chart: {
            animation: false
        },
        boost: {
            useGPUTranslations: true,
            usePreallocated: true
        },
        title: {
            text: 'Частота'
        },
        xAxis: {
            title: {
                text: 'дб/мкВ'
            }
        },
        yAxis: {
            title: {
                text: 'МГц'
            }
        },
        // legend: {
        //     layout: 'vertical',
        //     align: 'right',
        //     verticalAlign: 'middle'
        // },
        plotOptions: {
            series: {
                // color: chartColor,
                label: {
                    connectorAllowed: false
                },
                pointStart: 0
            }
        },
        series: [{
            name: 'Amplitudes',
            data: []
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });

    //---------------------------------------------------------

    let spec = new Highcharts.chart('specter', {


        chart: {
            type: 'heatmap',
            animation: false
        },

        boost: {
            useGPUTranslations: true
            // usePreallocated: true
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
            boostThreshold: 1,
            colsize: 400000,
            data: []
        }]

    });



})();
