
function Proetus(table) {
	this.table = table;
}

Proetus.prototype = {
	load: function(list) {
		console.log('loading list...');
		
	},

	setEngineer: function(engineer) {
		this.engineer = engineer;
		if (!jQuery.isEmptyObject(this.engineer)) {
			this.engineer = engineer;
			this.getServiceRequests();
		}
	},

	getEngineer: function() {
		return this.engineer;
	},

	getServiceRequests: function() {
		var that = this;
		if (!jQuery.isEmptyObject(this.engineer)) {
			request = $.ajax({
		        url: "getServiceRequests",
		        type: "post",
		        timeout:5000,
		        data: JSON.stringify({ 'engineer': this.engineer }),
		        contentType: "application/json",
		        success: function(res){ 
					// console.log(res);
					// that.viewList(res);
					list = [{'engineer': 'engineer>','sr': 'sr#','status': 'status','brief': 'briefDescription','lastActivity': 'lastActivity', 'lastActivityDate': 'lastActivityDate','primaryContact': 'primaryContact','alternateContact': 'alternateContact'},{'engineer': 'engineer','sr': 'sr#','status': 'status','brief': 'briefDescription','lastActivity': 'lastActivity', 'lastActivityDate': 'lastActivityDate','primaryContact': 'primaryContact','alternateContact': 'alternateContact'},{'engineer': 'engineer','sr': 'sr#','status': 'status','brief': 'briefDescription','lastActivity': 'lastActivity', 'lastActivityDate': 'lastActivityDate','primaryContact': 'primaryContact','alternateContact': 'alternateContact'}];
				},
				error: function(res){
					console.log(res);
					$("#userid").notify("User not found!", { className: 'error', elementPosition:"botom left" });
				}
		    });
		}
	},

	viewList: function(list) {
		// console.log(list);
		list = [{'engineer': 'engineer>','sr': 'sr#','status': 'status','brief': 'briefDescription','lastActivity': 'lastActivity', 'lastActivityDate': 'lastActivityDate','primaryContact': 'primaryContact','alternateContact': 'alternateContact'},{'engineer': 'engineer','sr': 'sr#','status': 'status','brief': 'briefDescription','lastActivity': 'lastActivity', 'lastActivityDate': 'lastActivityDate','primaryContact': 'primaryContact','alternateContact': 'alternateContact'},{'engineer': 'engineer','sr': 'sr#','status': 'status','brief': 'briefDescription','lastActivity': 'lastActivity', 'lastActivityDate': 'lastActivityDate','primaryContact': 'primaryContact','alternateContact': 'alternateContact'}];

		list.forEach(this.addRow(this, list));
	},

	addRow: function(that, list) {
		return function(item) {
			list.forEach(function(item){
				var table = that.table;
				var row = table.insertRow(-1);
				row.insertCell(0).innerHTML = item.sr;
				row.insertCell(1).innerHTML = item.brief;
				row.insertCell(2).innerHTML = item.status;
				row.insertCell(3).innerHTML = item.primaryContact;
				row.insertCell(4).innerHTML = item.alternateContact;
				row.insertCell(5).innerHTML = item.lastActivityDate;
				$(row).click(function(){
					this.classList.toggle('success');
				});
			});
		}
	},

	sendEmail: function() {
		var rows = $('tr.success', this.table);
		console.log(rows);
	}
}