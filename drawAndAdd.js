var zyscom = {
        /**添加标注
     * @param {*vector source} source 
     * @param {*经度 Number} lng 
     * @param {*纬度 Number} lat 
     * @param {*图片地址} src 
     * @param {*图片旋转角度 Number 360} angle
     */
    addMarker:function(source,lng,lat,src,angle){
        var marker = new ol.Feature({
            // geometry: new ol.geom.Point(ol.proj.fromLonLat([lng,lat])),
            geometry: new ol.geom.Point([lng,lat]),
        });
        
        //设置点标记样式
        var style = new ol.style.Style({
            image: new ol.style.Icon({
                src: src,
                // anchor: [0,0], //点标记偏移,
                imgSize:[19,33],
                rotation:angle?angle/180*Math.PI:0
            }),
            // zIndex: 999
        });
        marker.setStyle(style);
        // marker.getStyle().getImage().setRotation(rotation/180*Math.PI);
        source.addFeature(marker);
        //
        return marker;
    },
    /**添加线
     * @param {* vector source} source 
     * @param {*坐标数组格式[[lng,lat],[lng,lat]]} coordinates 
     * @param {*} param 
     */
    addLineString:function(source,coordinates,param){
        // coordinates = [[123,23.2],[123.1,23.3],[123.3,23.4],[123.4,23.5]]
        var line = new ol.geom.LineString(coordinates);
        var feature = new ol.Feature({
            geometry: line
        });
        //可选参数
        var color = (param!=undefined && param.color!=undefined)?param.color:'#3399CC';
        var width = (param!=undefined && param.width!=undefined)?param.width:1.5;

        var stroke = new ol.style.Stroke({
            color: color,
            width: width
        });

        var style = new ol.style.Style({
            stroke: stroke
        })
        feature.setStyle(style);
        source.addFeature(feature);
        return feature;
    },
    /**
     * 添加圆
     * @param {*vectorSource} source 
     * @param {*经度 Number} lng 
     * @param {*纬度 Number} lat 
     * @param {*单位为米} radius 
     */
    addCircle:function(source,lng,lat,radius){
        var center = [lng,lat];
        var options = {steps: 64, units: 'kilometers'};
        var circle = turf.circle(center, radius/1000, options);

        var style = new ol.style.Style({
            fill:new ol.style.Fill({
                color:'rgba(238,34,0,0.35)'
            }),
            stroke:new ol.style.Stroke({
                width:3,
                color:'rgba(255,51,51,1)'
            })
        })
        var feature = new ol.Feature({
            geometry:new ol.geom.Polygon(circle.geometry.coordinates)
        })
        feature.setStyle(style);
        source.addFeature(feature);
        return feature;
    },
    /**添加多边形
     * @param {*vectorSource} source 
     * @param {*数组格式 [[[lng,lat],[lng,lat]]] } coordinates 3层[]记住
     */
    addPolygon:function(source,coordinates){
        //coordinates = [[[125,23.2],[123.1,23.3],[123.3,23.4],[123.4,23.5],[125,23.2]]]
        var polygon  = new ol.geom.Polygon(coordinates,'XY');
        var feature = new ol.Feature({
            geometry: polygon
        });

        var stroke = new ol.style.Stroke({
            color: "rgba(255,51,255,1)",
            width: 3
        });
        var fill = new ol.style.Fill({
            color:'rgba(23,145,252,0.35)'
        })
        var style = new ol.style.Style({
            stroke:stroke,
            fill:fill
        })
        feature.setStyle(style);
        source.addFeature(feature);
        return feature;
    },
    /**添加矩形
     * @param {*vectorSource} source 
     * @param {*数组格式  [[[lng,lat],[lng,lat],[lng,lat],[lng,lat]]] } coordinates 3层[]记住
     */
    addRectangle:function(source,coordinates){
        //coordinates = [[[125,23.2],[123.1,23.3],[123.3,23.4],[123.4,23.5]]]
        var polygon  = new ol.geom.Polygon(coordinates,'XY');
        var feature = new ol.Feature({
            geometry: polygon
        });

        var stroke = new ol.style.Stroke({
            color: "rgba(255,51,255,1)",
            width: 3
        });
        var fill = new ol.style.Fill({
            color:'rgba(23,145,252,0.35)'
        })
        var style = new ol.style.Style({
            stroke:stroke,
            fill:fill
        })
        feature.setStyle(style);
        source.addFeature(feature);
        return feature;
    },
}

// 上面的帮助类 前面已经给你

/**画图工具*/
zyscom.draw = {
    coordinates:[],
    currentFeature:null,
    /*
     *画标记
     */
    drawMarker:function(map,source,src,callback){
        var that = this;
        that.coordinates = [];
        that.currentFeature = null;
        map.once('click', function(e){
            that.currentFeature = zyscom.addMarker(source,e.coordinate[0],e.coordinate[1],src);
            callback(that.currentFeature)
        })
    },
    /**画线 */
    drawLineString:function(map,source,callback){
        var that = this;
        that.coordinates = [];
        that.currentFeature = null;
        
        var clickEvent = map.on('click',function(e){
            that.coordinates.push(e.coordinate);
            if(that.currentFeature){
                that.currentFeature.getGeometry().setCoordinates(that.coordinates);
            }else{
                that.currentFeature = zyscom.addLineString(source,that.coordinates);
            }
        });

        map.once('dblclick',function(e){
            ol.Observable.unByKey(clickEvent);
            callback(that.coordinates);
        })
    },
    /**
     * 画圆
     */
    drawCircle:function(map,source,callback){
        var that = this;
        this.coordinates = [];
        that.currentFeature = null;

        var clickEvent = map.on('click',function(e){
            that.coordinates.push(e.coordinate);
            if(that.coordinates.length == 2){
                var length = that.getLengthByTwoLngLat(that.coordinates);
                that.currentFeature = zyscom.addCircle(source,that.coordinates[0][0],that.coordinates[0][1],length);
                ol.Observable.unByKey(clickEvent);
                callback(that.currentFeature);
            }
        });
    },
    /**
     * 画多边形
     */
    drawPolygon:function(map,source,callback){
        var that = this;
        this.coordinates = [];
        that.currentFeature = null;
        
        var clickEvent = map.on('click',function(e){
            that.coordinates.push(e.coordinate);
            if(that.currentFeature == null){
                if(that.coordinates.length>2){
                    that.currentFeature = zyscom.addPolygon(source,[that.coordinates]);
                }
            }else{
                that.currentFeature.getGeometry().setCoordinates([that.coordinates]);
            }
        });

        map.once('dblclick',function(e){
            ol.Observable.unByKey(clickEvent);
            callback(that.currentFeature);
            that.coordinates = [];
            that.currentFeature = null;
        })
    },
    /**
     * 画矩形
     */
    drawRectangle:function(map,source,callback){
        var that = this;
        this.coordinates = [];
        that.currentFeature = null;
        
        var clickEvent = map.on('click',function(e){
            that.coordinates.push(e.coordinate);
            if(that.coordinates.length == 2){
                var coordinates = that.getRectangleCoordinates(that.coordinates);
                that.currentFeature = zyscom.addRectangle(source,[coordinates]);
                ol.Observable.unByKey(clickEvent);
                callback(that.currentFeature);
            }
        });
    },
    /**
     * 根据两个经纬度数组返回两者距离单位米
     * @param {两个经纬度数组} coordinates 
     */
    getLengthByTwoLngLat:function(coordinates){
        var from = turf.point(coordinates[0]);
        var to = turf.point(coordinates[1]);
        var options = {units: "kilometers"};
        var distance = turf.distance(from, to, options)*1000;
        return distance;
    },
    /**
     * 根据两个经纬度数组返回矩形经纬度数组
     * @param {两个经纬度数组} coordinates 
     */
    getRectangleCoordinates:function(coordinates){
        var point1 = coordinates[0];
        var point2 = [coordinates[0][0],coordinates[1][1]];
        var point3 = coordinates[1];
        var point4 =  [coordinates[1][0],coordinates[0][1]];
        return [point1,point2,point3,point4];
    }
    
}




//调用
// zyscom.draw.drawMarker(map,source,'./img/mark_bs.png',function(feature){});
// zyscom.draw.drawLineString(map,source,function(feature){});
// zyscom.draw.drawPolygon(map,source,function(){feature}{});
// zyscom.draw.drawCircle(map,source,function(feature){});
//zyscom.draw.drawRectangle(map,source,function(feature){});