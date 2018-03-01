<div class="app__item" id="restaurant">
		<button id="dsd">dsd</button>
</div>
<script type="text/JavaScript">
	$('#dsd').on('click', function(_e){
		 $.ajax({ type: "POST",
		 url: "http://xn--80aaasqiegq2eub9c.xn--p1ai/",
		 contentType: "application/x-www-form-urlencoded; charset=utf-8",
		 dataType: "json",
		 data: {identity: <username from form>, password: <password from form>},
		 crossDomain: true,
		 cache: false,
		 success: function(data) {
			 obj = JSON.parse(data);
			 if (obj && obj.success === true) {
				 window.location.href = 'home.html';
			 }
		 },
		 error: function(e) {
			 alert('Error: ' + e.message);
		 }
	 });
	});
</script>
