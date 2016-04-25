//Dependencies

var moment = require('moment');

module.exports = function dateInput (dateFrom, dateTo, callback, dateType, period) {
	if(dateType != 'months' && dateType != 'years' && dateType != 'days'){
		dateType = 'days';
	}

	if(typeof period !== 'number'){
		if(dateType == 'days'){
			period = 28;
		} else {
			period = 1;
		}
	}

	if(dateFrom){
		dateFrom = moment(new Date(dateFrom)).isValid() ? moment(new Date(dateFrom)).format() : moment().format();
	} else {
		dateFrom = moment(new Date()).subtract(period, dateType).format();
	}

	if(dateTo){
		dateTo = moment(new Date(dateTo)).isValid() ? moment(new Date(dateTo)).format() : moment().format();
	} else {
		dateTo = moment(new Date()).add(period, dateType).format();
	}

	callback({"from": dateFrom, "to": dateTo});
}