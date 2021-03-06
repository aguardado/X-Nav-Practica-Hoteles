var newCollection = new Object();
var apiKey = 'AIzaSyCIsboejQB1SBYOsR9K659Sd_G9GzYTAuY';


//102452679496186691364
//+GregorioRobles

function show_accomodation(){
	var accomodation = accomodations[$(this).attr('no')];
	var lat = accomodation.geoData.latitude;
	var lon = accomodation.geoData.longitude;
	var url = accomodation.basicData.web;
	var name = accomodation.basicData.name;
	var desc = accomodation.basicData.body;
	if(accomodation.multimedia != undefined){
		if(accomodation.multimedia.media[0] != undefined){
			var img = accomodation.multimedia.media[0].url;
		}
	}
	
	var marker = L.marker([lat, lon]).addTo(map).bindPopup('<a href="' + url + '">' + name + '</a><br/>').openPopup();
	
	console.log($(this).css("color"));
	
	if($(this).css("color") == "rgb(0, 0, 0)"){
		map.removeLayer(marker);
		$(this).css("color") == "rgb(0, 0, 255)"
	}else{
		map.setView([lat, lon], 15);
	}

	marker.on("popupclose", function(){
		map.removeLayer(marker);
	})
	
	var cat = accomodation.extradata.categorias.categoria.item[1]['#text'];
	if(accomodation.extradata.categorias.categoria.subcategorias != undefined){
		var subcat = accomodation.extradata.categorias.categoria.subcategorias.subcategoria.item[1]['#text'];
	}
	
	if(img){
		$('#desc').html('<h2>' + name + '</h2>' + '<p>Type: ' + cat + ', subtype: ' + subcat + '</p>' + desc + '<img src="' + img + '"">');
	}else{
		$('#desc').html('<h2>' + name + '</h2>' + '<p>Type: ' + cat + ', subtype: ' + subcat + '</p>' + desc);
	}
};

function get_hoteles(){
	$.getJSON("alojamientos.json", function(data) {
	
		$(".js-load-hoteles").html('Hoteles cargados abajo!!');
	    
	    accomodations = data.serviceList.service
	    	    
	    var list = '<p class="info-extra">Hoteles encontrados: ' + accomodations.length
	     + ' (Pulse encima de cada nombre del hotel para mas informacion)</p>'
	     
	    list = list + '<ul>'
	    
	    for (var i = 0; i < accomodations.length; i++) {
	      list = list + '<li no=' + i + '>' + accomodations[i].basicData.title + '</li>';
	    }
	    
	    list = list + '</ul>';
	    
	    $('#list').html(list);
	    $("#list li").attr("draggable", "true");
	    $("#list li").draggable({revert:true,appendTo:"body",helper:"clone"});
	    $('#list li').click(show_accomodation);
	    $('#list li').click(function(){
		   $(this).toggleClass('active');
	    });
	});
}

function evdragover(event){}

function evdrop(event){}

function evend(event){}

function handleClientLoad(){
	console.log("plus");
	gapi.client.setApiKey(apiKey);
}
	
	
function makeApiCall(user) {
	handleClientLoad();
	gapi.client.load('plus', 'v1', function() {
		var request = gapi.client.plus.people.get({
			'userId': user
		});

		request.execute(function(resp) {
			var heading = document.createElement('h4');
			var image = document.createElement('img');
			image.src = resp.image.url;
			heading.appendChild(image);
			heading.appendChild(document.createTextNode(resp.displayName));

			document.getElementById('set-alojados').appendChild(heading);
			
			$('.zona-usuarios').append(heading);
			$('.zona-usuarios').append(image);
		});
	});
}


$(document).ready(function(){
	map = L.map('map').setView([40.4175, -3.708], 11);
	  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	  }).addTo(map);
	
	L.control.scale().addTo(map);
	
	$(".js-load-hoteles").click(get_hoteles);
	
	$(".js-trigger-view").click(function(){
		$(".js-trigger-view").closest("li").removeClass("active");
		$(this).closest('li').addClass('active');
		var data = $(this).attr('data-toggle');
		
		$(".js-view").css("display", "none");
		$("#" + data).css("display", "block");
	});
	
	$(".save").click(function(){
		var token = $("#token").val();
		var repo = $("#repositorio").val();
		var file = $("#nombre").val();
		var texto = JSON.stringify(newCollection);
		var github = new Github({token:token,auth:"oauth"});

		var repository = github.getRepo("aguardado", repo);
		repository.write("master", file, texto, "nueva coleccion", function(err){});
	});
		
	$(".zona-arrastre").droppable({
		accept: "#list li",
		activeClass: "ui-state-hover",
		hoverClass: "ui-state-active",
		drop: function(event, ui) {
			var name = $(".name-collection").text();
			if (name == ""){
				return;
			}
			var no = ui.draggable[0].attributes[0].value;
			var hotel = accomodations[no].basicData.name;
			newCollection[name].push(accomodations[no]);
			console.log();
			$(".zona-arrastre ul").append("<li>" + hotel + "</li>");
		}
	});
	
	$('.js-set-name').click(function(){
		var name = $('#name-collection').val();
		if(name == "")
			return;
			
		$(".name-collection").html(name);
		newCollection[name] = [];
	});
	
	
	
	
	$('.js-set-alojados').click(function(){
		var user = $("#set-alojados").val();
		console.log(user);
		if(user == "")
			return;
			
		makeApiCall(user);
	});
	
	
});