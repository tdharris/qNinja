module.exports=function(emailAddresses, callback){

  // Deal with emailAddresses
  function validateEmail(email){
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  emailAddresses.forEach(function(emailAddress){
      if(!validateEmail(emailAddress)){
        emailAddresses.pop(emailAddress);
      }
  });

  callback(emailAddresses);
}
