$( document ).ready(function() {

	var proetus = new Proetus(document.getElementById('serviceRequests'));

	tinymce.init({
	    selector: "textarea",
	    plugins: [
	         "advlist autolink link image lists charmap preview hr anchor pagebreak",
	         "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime nonbreaking",
	         "save table contextmenu directionality template paste textcolor importcss"
	   ],
	   toolbar_items_size: 'small',
	   content_css: "css/tinymce_content.css",
	   templates: [ 
	        {title: 'Followup', description: 'Description?', content: 'My content'}, 
	        {title: 'Schedule to Close', description: 'Description?', content: "Just checking in to verify the issue has been resolved. I'll be placing this SR in a Schedule to Close state. If I don't hear back from you, I'll go ahead and close the SR. Feel free to contact me."}, 
	        {title: 'Closing SR', description: 'Description?', content: 'My content'},
	        {title: 'EMEA', description: 'Description?', content: "I see our timezones are very different. Are you available to work on this issue now?  I will keep this Service Request until the end of my shift. If I don't hear back from you, I'll move this SR to a team closer to your timezone."},
	        {title: 'Escalate', description: 'Description?', content: 'My content'}
	    ],
	   toolbar: "template | insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | l      ink image | preview fullpage | forecolor backcolor"
	 }); 

	$('#userid').focusout(function () {
		proetus.setEngineer($('#userid').val());
	});
	
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

    // Selectable rows in bootstrap table
	$("tr").click(function(){
		this.classList.toggle('success');
	});

	$("#sendMail").click(function(){
		proetus.sendEmail();
	});

});