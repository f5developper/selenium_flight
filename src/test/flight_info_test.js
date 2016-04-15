var flight_info = require('../moduls/flight_info.js');


var data = {flightId: 'MM217',
    airlineCompanyCd: '',
    airlineCompanyName: '',
    leavedFrom: 'KIX',
    leavedFromName: '大阪（関西）\n出発',
    leavedAt: '14:15',
    arrivalTo: 'OKA',
    arrivalToName: '沖縄（那覇）\n到着',
    arrivalAt: '',
    flightPlan: '片道',
    vacancyStatus: '',
    amount:
            [{key: 'ハッピーピーチ', amount: '5,590'},
                {key: 'ハッピーピーチプラス', amount: '8,090'}],
    createdAt: ''
};
flight_info.flight_info.append(data);
console.log("aaa");