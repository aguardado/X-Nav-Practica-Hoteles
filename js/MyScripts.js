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
	    $('#list li').click(show_accomodation);
	    $('#list li').click(function(){
		   $(this).toggleClass('active');
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
	
	/*
$(".js-load-hoteles").click(function(){
		console.log("pepe");
		get_hoteles();
	});
*/
});