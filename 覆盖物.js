/*添加覆盖物*/
zyscom.addOverlayContainer = function(map,feature,element){
    var that = this;
    that.feature = feature;
    that.element = element
    that.popup = zyscom.popup;
    that.visible = false;
    
    //显示
    that.show = function(){
        that.popup.show(that.feature.getGeometry().getCoordinates(), that.element);
    }

    //隐藏
    that.hide = function(){
        that.popup.hide();
    }

    map.on('click', function (evt) {
        var pixel = map.getEventPixel(evt.originalEvent);
        var feature = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
            return feature;
        });
        if (feature == that.feature) {
            if(that.visible == false){
                that.show();
            }else{
                that.hide();
            }
            that.visible = !that.visible;
        }
    });
}

    //调用
    var marker = zyscom.addMarker(source,123,28,'./img/mark_bs.png',90);
    var div = $("<p class='carNameShowRD' id='overlay'><i class='carStateStop'></i>&nbsp;苏FC02B8</p>");
    var b = new zyscom.addOverlayContainer(map,marker,$(div)[0]);

    var marker1 = zyscom.addMarker(source,124,28,'./img/mark_bs.png',90);
    var div1 = $("<p class='carNameShowRD' id='overlay1'><i class='carStateStop'></i>&nbsp;苏FC02B8</p>");
    var a = new zyscom.addOverlayContainer(map,marker1,$(div1)[0]);