'use strict';

angular.module('cartpool').factory('arLang', [function () {
	return {
		'admin': 'إداري',
		'pending': 'معلقة',
		'close': 'مغلقة',
		'closed': 'مغلقة',
		'client': 'موكل',
		'defendant': 'خصم',
		'case': 'قضية',
		'update': 'تحديث',
		'session': 'جلسة',
		'employee': 'موظف',
		'user': 'مستخدم',
		'consultant': 'مستشار',
		'email already exist': 'البريد الإلكتروني غير متاح',
		'open': 'سارية',
		'first respondant': 'المدعى عليه الأول',
		'true': 'نعم',
		'false': 'لا',
		'client already exists': 'الموكل مضاف مسبقا',
		'defendant already exists': 'الخصم مضاف مسبقا',
		'no file has been uploaded': 'لم يتم رفع أي مستند',
		'current password is not correct': 'كلمة السر الحالية غير صحيحة'
	}
}]);