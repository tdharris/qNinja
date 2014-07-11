module.exports=function(emailAddresses, callback){

  function looksLegit(str) {
    var lastAtPos = str.lastIndexOf('@');
    var lastDotPos = str.lastIndexOf('.');
    return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
  }

  emailAddresses.forEach(function(email, index){
    if(!looksLegit(email)){
      emailAddresses.splice(index);
    }
  });

  callback(emailAddresses);
}
