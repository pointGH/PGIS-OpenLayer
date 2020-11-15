var map
function init(){
    map = new ol.Map({
        target:'map',
        view:new ol.View({
            // center:ol.proj.fromLonLat([123,28]),
            center:[123,28],
            zoom:7,
            projection: 'EPSG:4326',
        })
    })
    var layer1 = new ol.layer.Tile({
        //title: "天地图路网dddd",
        source: new ol.source.XYZ({
            url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=49ea1deec0ffd88ef13a3f69987e9a63"
        })
    })

    //天地图注记
    var  layer2 = new ol.layer.Tile({
        title: "天地图文字标注",
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=49ea1deec0ffd88ef13a3f69987e9a63'
        })
    })

    //天地图卫星影像
    var  layer3 = new ol.layer.Tile({
        title: "天地图卫星影像",
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=49ea1deec0ffd88ef13a3f69987e9a63'
        })
    })
    
    var group = new ol.layer.Group({
        layers:[layer3,layer2]
    })

    map.setLayerGroup(group);
    // map.addLayer(zyscom.baseXYZLayer());
    // map.addLayer(zyscom.OSMLayer())
    var source = new ol.source.Vector({})
    var vectorLayer = new ol.layer.Vector({
        source:source
    })
    map.addLayer(vectorLayer);
    // vectorLayer
    //<p class='carNameShowRD' id="overlay"><i class='carStateStop'></i>&nbsp;苏FC02B8</p>
    // var marker = zyscom.addMarker(source,123,28,'http://127.0.0.1:5500/img/mark_bs.png',90);
    // zyscom.addOverlay(map,123,28,'testdid6',"苏FC02B8");
    // zyscom.addOverlay(map,123,28,'testwidd5',"苏FC02B8");
    // zyscom.addOverlay(map,123,28,'tewstid4',"苏FC02B8");
    // zyscom.addOverlay(map,123,28,'teswtid2',"苏FC02B8");
    // zyscom.addOverlay(map,123,28,'teswtid3',"苏FC02B8");

    // zyscom.removeAllOverlay(map);

    // zyscom.draw.drawMarker(map,source,'./img/mark_bs.png',function(feature){});
    // zyscom.draw.drawLineString(map,source,function(feature){});
    // zyscom.draw.drawPolygon(map,source,function(){feature}{});
    // zyscom.draw.drawCircle(map,source,function(feature){});
    // zyscom.draw.drawRectangle(map,source,function(feature){});

    // zyscom.removeMarker(source,marker);
    // zyscom.setMarkerHide(marker);
    // zyscom.getMarkerCoordinate(marker);
    // zyscom.setMarkerCoordinate(marker,123,25);

    // zyscom.setZoomAndCenter(map,6,[123,25])
    var path = [[123,24],[127,28],[128,29],[127,29],[126,29],[128,23],[128,25],[128,26]];
    var vehiclePath = new zyscom.vehiclePath(map,path,'./img/mark_bs.png','./img/arrow.png',vectorLayer,{speed:2})
    vehiclePath.start();
    
    // zyscom.setMarkerRotation(marker,180);
    // console.log(zyscom.getMarkerRotation(marker));
    // zyscom.addLineString(source,[[123,23.2],[123.1,23.3],[123.3,23.4],[123.4,23.5]])
    // zyscom.addCircle(source,121.319091796875, 28.5438232421875,212896.9711362303)
    // zyscom.addPolygon(source,[[[125,23.2],[123.1,23.3],[123.3,23.4],[123.4,23.5],[125,23.2]]]);
    // zyscom.initOverlay(map);
    // var marker = zyscom.addMarker(source,123,28,'./img/mark_bs.png',90);
    // var div = $("<p class='carNameShowRD' id='overlay'><i class='carStateStop'></i>&nbsp;苏FC02B8</p>");
    // var b = new zyscom.addOverlayContainer(map,marker,$(div)[0]);

    // var marker1 = zyscom.addMarker(source,124,28,'./img/mark_bs.png',90);
    // var div1 = $("<p class='carNameShowRD' id='overlay1'><i class='carStateStop'></i>&nbsp;苏FC02B8</p>");
    // var a = new zyscom.addOverlayContainer(map,marker1,$(div1)[0]);

    // window.onresize = function(){
    //     setTimeout( function() { map.updateSize();}, 200);
    // }


    // zyscom.dragZoomBig(map);
    // zyscom.dragZoomSmall(map,true);
    // zyscom.dragZoomSmall(map,false);
    // zyscom.dragZoomBig(map,true);
    // zyscom.dragZoomBig(map,false);

    // var marker = zyscom.addMarker(source,123,28,'./img/mark_bs.png',90);
    // zyscom.markerFly(marker,123,29,10);
}

