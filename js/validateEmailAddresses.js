var myUtil = require('./myUtil');

module.exports=function(addresses, callback){

  function looksLegit(str) {
    var lastAtPos = str.lastIndexOf('@');
    var lastDotPos = str.lastIndexOf('.');
    return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
  }

  // Reason for reverse for loop vs forEach: https://gist.github.com/chad3814/2924672
  for (i = addresses.length - 1; i >= 0; i -= 1) {

    if (!looksLegit(addresses[i]) || myUtil.isEmpty(addresses[i])) {
      // console.log('invalid address: ', addresses[i]);
      addresses.splice(i, 1);
    }

    if(i === 0) {
      callback(null, addresses);
    }

  }
  
}