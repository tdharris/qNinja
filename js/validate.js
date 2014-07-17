var myUtil = require('./myUtil');

module.exports = function validate(addresses){

    function looksLegit(str) {
        var lastAtPos = str.lastIndexOf('@');
        var lastDotPos = str.lastIndexOf('.');
        return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
    }

    // filter out any emails that aren't valid
    return (addresses||[]).filter(function(str) {
    	// console.log('\nValidating ', str);
    	// console.log('looksLegit: ', looksLegit(str));
    	// console.log('!IsEmpty: ', ! myUtil.isEmpty(str));
        return looksLegit(str) && ! myUtil.isEmpty(str);
    });
}