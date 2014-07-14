$( document ).ready(function() {

    // Switch - Mail From: userid@novell.com or support@novell.com
    $('.btn-toggle').click(function() {
	    $(this).find('.btn').toggleClass('active');

	    if ($(this).find('.btn-primary').size()>0) {
	    	$(this).find('.btn').toggleClass('btn-primary');
	    }
	    if ($(this).find('.btn-danger').size()>0) {
	    	$(this).find('.btn').toggleClass('btn-danger');
	    }
	    if ($(this).find('.btn-success').size()>0) {
	    	$(this).find('.btn').toggleClass('btn-success');
	    }
	    if ($(this).find('.btn-info').size()>0) {
	    	$(this).find('.btn').toggleClass('btn-info');
	    }

	    $(this).find('.btn').toggleClass('btn-default');
    });

    // getServiceRequests on enter keypress from userid field

});
