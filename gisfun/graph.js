var zyscom = {
    /**XYZ底图**/
    baseXYZLayer:function(){
        var layer = new ol.layer.Tile({
            source:new ol.source.XYZ({
                url:'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            })
        })
        return layer;
    },
    /**opemstreetmap底图**/
    OSMLayer:function(){
        var layer = new ol.layer.Tile({
            preload: 4,
            source: new ol.source.OSM()
        })
        return layer;
    },
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
    /**
     * 获取点标记旋转角度
     * @param {*点标记} marker 
     * @return {*角度 360}
     */
    getMarkerRotation:function(marker){
        var rotation = marker.getStyle().getImage().getRotation()*180/Math.PI;
        return rotation;
    },
    /**
     * 获取点标记旋转角度
     * @param {*点标记} marker 
     * @param {*角度 360} rotation
     */
    setMarkerRotation:function(marker,rotation){
        var rotation = marker.getStyle().getImage().setRotation(rotation/180*Math.PI);
        return rotation;
    },
    setMarkerHide:function(marker){
        var stroke = new ol.style.Stroke({
            color: "transparent",
            width: 3
        })
        marker.getStyle().setStroke(stroke);
    },
    setMarkerShow:function(marker){
        marker.getStyle().setStroke(null);
    },
    removeMarker:function(source,marker){
        source.removeFeature(marker);
    },
    setZoomAndCenter:function(map,zoom,center) {
		map.getView().animate({center:center,zoom:zoom});
    },
    getMarkerCoordinate:function(marker){
        return marker.getGeometry().getCoordinates();
    },
    setMarkerCoordinate:function(marker,lng,lat){
        marker.getGeometry().setCoordinates([lng,lat]);
    },
    /**
	 * 获取地图经纬度矩形范围
	 * @returns 地图经纬度矩形范围，LTMap.Bounds格式
	 */
	getBounds:function(map) {
		var bounds = map.getView().calculateExtent(map.getSize());
		var southWest = [bounds[0],bounds[1]];
		var northEast = [bounds[2],bounds[3]];		
        var mapBound = [southWest,northEast];
		return mapBound; 
	},
	/**
	 * 设置地图经纬度矩形范围
	 * @param bound 地图经纬度矩形范围，LTMap.Bounds格式，必填
	 */
	setBounds:function(bounds) {
		map.getView.fit(bounds); //地图视角切换到矩阵范围			
    },
    LimitedSize:function(map,size){
        var southwest = this.getBounds(map)[0];
        var northeast = this.getBounds(map)[1];
        
        var possa = southwest[0];
        var possn = southwest[1];
        var posna = northeast[0];
        var posnn = northeast[1];

        var psa = possa - ((posna - possa) * size);
        var psn = possn - ((posnn - possn) * size);
        var pna = posna + ((posna - possa) * size);
        var pnn = posnn + ((posnn - possn) * size);
        var paths = [
            [psn, psa], //西南角坐标
            [pnn, pna]//东北角坐标
        ]
        this.setBounds(paths);
    },
    addOverlay:function(map,lng,lat,id,vehicleText){
        var element = $("<p class='carNameShowRD' id='"+id+"'><i class='carStateStop'></i>&nbsp;"+vehicleText+"</p>")
        var overlay = new ol.Overlay({
            id:id,
            position:[lng,lat],
            positioning:'left-top',
            element:$(element)[0]
        })
        map.addOverlay(overlay)
        return overlay;
    },
    removeAllOverlay:function(map){
        map.getOverlays().clear();
    },
    /**
	 * 地图视角缩放到线标记范围
	 * @param duration 动画持续时间(单位:毫秒) 选填，默认0毫秒
	 */
	zoomToLineString:function(map,polyline) {
		var LonLatArray = polyline.getGeometry().getCoordinates();
		var extentBound = new ol.extent.boundingExtent(LonLatArray);
		map.getView().fit(extentBound,{
			duration: 0
		});
    },
    setMarkerZIndex:function(marker,index){
        marker.getStyle().setZIndex(index);
    },
    dragZoomBig:function(map,isHandler){
        var interactions = map.getInteractions();
        interactions.forEach(function(item){
            if(item.getProperties()["dragZoomBig"] == true || item.getProperties()["dragZoomSmall"] == true){
                map.removeInteraction(item);
            }
        })
        if(isHandler){
            var interaction = new ol.interaction.DragZoom({
                condition:ol.events.condition.always,
                out:false,
                minArea:128
            })//放大
            interactions.setProperties({"dragZoomBig":true}, true);
            map.addInteraction(interaction);
        }
    },
    dragZoomSmall:function(map,isHandler){
        var interactions = map.getInteractions();
        interactions.forEach(function(item){
            if(item.getProperties()["dragZoomBig"] == true || item.getProperties()["dragZoomSmall"] == true){
                map.removeInteraction(item);
            }
        })
        if(isHandler){
            var interaction = new ol.interaction.DragZoom({
                condition:ol.events.condition.always,
                out:true,
                minArea:128
            })//缩小
            interaction.setProperties({"dragZoomSmall":true}, true);
            map.addInteraction(interaction);
        }
    }
}

zyscom.pathStyle = function(street,map,arrowUrl){
    var vSource = new ol.source.Vector()
    var vLayer = new ol.layer.Vector(
        {
        source: vSource,
        }
    )
      //some styles =========================================================================
      var textStyle = new ol.style.Style({
        text: new ol.style.Text({
          font: 'bold 26px Mirosoft Yahei',
          placement: 'line',
        //   text: "江 南 大 街",
          fill: new ol.style.Fill({
            color: '#000'
          }),
          offsetY:3,
          stroke: new ol.style.Stroke({
            color: '#FFF',
            width: 2
          })
        })
      })
      var buttomPathStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: [4, 110, 74],
          width: 14
        }),
      })
      var upperPathStyle = new ol.style.Style({
      
        stroke: new ol.style.Stroke({
          color: [0, 186, 107],
          width: 12
        }),
      })
      var outStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          fill: new ol.style.Fill({
            color: [4, 110, 74]
          })
        })
      })
      var midStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 8,
          fill: new ol.style.Fill({
            color: [0, 186, 107]
          })
        })
      })
      var innerDot = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 3,
          fill: new ol.style.Fill({
            color: [255, 255, 255]
          })
        })
      })
      var foutrStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          fill: new ol.style.Fill({
            color: "#000"
          })
        })
      })
      var fmidStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 8,
          fill: new ol.style.Fill({
            color: '#FFF'
          })
        })
      })
      var finnerStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 3,
          fill: new ol.style.Fill({
            color: '#000'
          })
        })
      })
      street.setStyle(textStyle);
      vSource.addFeature(street)
      //some styles end =========================================================================
      
      var offset = 0.01;
      vLayer.on('postrender', (evt) => {
        var vct = ol.render.getVectorContext(evt);
        vct.drawFeature(street, buttomPathStyle)
        vct.drawFeature(street, upperPathStyle)
        let numArr = Math.ceil((street.getGeometry().getLength() / map.getView().getResolution()) / 100)
        var points = []
        for (var i = 0; i <= numArr; i++) {
          let fracPos = (i / numArr) + offset;
          if (fracPos > 1) fracPos -= 1
          let pf = new ol.Feature(new ol.geom.Point(street.getGeometry().getCoordinateAt(fracPos)));
          points.push(pf);
        }
      
        //确定方向并绘制
        street.getGeometry().forEachSegment((start, end) => {
          points.forEach((item) => {
            let line = new ol.geom.LineString([start, end])
            let coord = item.getGeometry().getFirstCoordinate();
            let cPoint = line.getClosestPoint(coord);
            if (Math.abs(cPoint[0] - coord[0]) < 1 && Math.abs(cPoint[1] - coord[1]) < 1) {
              var myImage = new Image(117, 71);
              myImage.src = arrowUrl;
              let dx=end[0] - start[0];
              let dy=end[1] - start[1];
              var rotation = Math.atan(dx/dy);
              rotation=dy>0?rotation:(Math.PI+rotation);
              vct.setStyle(new ol.style.Style({
                image: new ol.style.Icon({
                  img: myImage,
                  imgSize: [16,16],
                  scale: 1,
                  rotation: rotation-0.5*Math.PI
                })
              }))
              vct.drawGeometry(item.getGeometry())
            }
          });
          vct.setStyle(outStyle)
          vct.drawGeometry(new ol.geom.Point(street.getGeometry().getFirstCoordinate()))
          vct.setStyle(midStyle)
          vct.drawGeometry(new ol.geom.Point(street.getGeometry().getFirstCoordinate()))
          vct.setStyle(innerDot)
          vct.drawGeometry(new ol.geom.Point(street.getGeometry().getFirstCoordinate()));
          vct.setStyle(foutrStyle)
          vct.drawGeometry(new ol.geom.Point(street.getGeometry().getLastCoordinate()))
          vct.setStyle(fmidStyle)
          vct.drawGeometry(new ol.geom.Point(street.getGeometry().getLastCoordinate()))
          vct.setStyle(finnerStyle)
          vct.drawGeometry(new ol.geom.Point(street.getGeometry().getLastCoordinate()));
        })
      
        // offset = offset + 0.003 
        // //复位
        // if (offset >= 1) offset = 0.001
        map.render()
      })
      return vLayer;
}
zyscom.vehiclePath = function(map,points,carurl,arrowUrl,layer,param){
    this.vectorLayer = layer;
    this.vectorLayer.setZIndex(99);
    this.now = null;
    var that = this;
    var lnglat = points[0];
    var source = layer.getSource();
    var time = (param!=undefined && param.time != undefined)? param.time*1000 : 2000;
    var scale = (param!=undefined && param.scale != undefined)? param.scale : 1;
    //车辆标记角度
    var angle = (param!=undefined && param.angle != undefined)? param.angle :null;
    //创建轨迹动画线标记及点标记
    // var polyLine = zyscom.addLineString(source,points);
    var polyLine = new ol.Feature({geometry:
        new ol.geom.LineString(points)
    })
    //路径图层，管理删除就删除他
    var layerPath = zyscom.pathStyle(polyLine,map,arrowUrl);
    map.addLayer(layerPath);

    var marker = zyscom.addMarker(source,lnglat[0],lnglat[1],carurl,angle); //起点标记
    marker.getStyle().getImage().setScale(scale);
    that.marker = marker;
    var line = turf.lineString(polyLine.getGeometry().getCoordinates());
    var options = {units: 'miles'};
    var i = 0;
    var length = turf.length(line, {units: 'miles'});
    var num = time/10;
    var step = length/num;
    this.start = function(){
        var interval = setInterval(function(){
            i++;
            var along1 = turf.along(line, step*(i)-1, options);
            var along2 = turf.along(line, step*(i)+1, options);
            // setIcongRotation(along1,along2,pointStyle);
            //获取两坐标角度
            var getAngle = function(lnglat,lnglat2) {
                var pi_90 = Math.atan2(1,0);
                var pi_xy = Math.atan2(lnglat2[1] - lnglat[1],lnglat2[0] - lnglat[0]);
                return pi_90 - pi_xy;
            };
            var angle = getAngle(along1.geometry.coordinates,along2.geometry.coordinates)
            marker.getStyle().getImage().setRotation(angle);
            // .setZIndex(99);
            marker.getGeometry().setCoordinates(along2.geometry.coordinates);
            if(i>num){
                window.clearInterval(interval)
            }
        },10)
    }
}

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

//初始化
zyscom.initOverlay = function(map){
    //Popup overlay with popupClass=anim
    zyscom.popup = new ol.Overlay.Popup ({
        popupClass: "default anim", //"tooltips", "warning" "black" "default", "tips", "shadow",
        positioning: "bottom-center",
        autoPan: true,
        autoPanAnimation: {duration:100},
        closeBox: true,
    });
    map.addOverlay(zyscom.popup);
}

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

/**
 * @param {*点标记} marker
 * @param {*新的经度} newlng
 * @param {*新的纬度} newlat
 * @param {*渲染时间} time
 */
zyscom.markerFly = function(marker,newlng,newlat,time){
    var coordinate = marker.getGeometry().getCoordinates();
    var newCoordinate = [newlng,newlat];

    var line = turf.lineString([coordinate,newCoordinate]);
    var totalTime = time?1000:time*1000;

    var options = {units: 'miles'};
    var i = 0;
    var length = turf.length(line, {units: 'miles'});
    var num = totalTime/10;
    var step = length/num;

    var interval = setInterval(function(){
        i++;
        var along1 = turf.along(line, step*(i)-1, options);
        var along2 = turf.along(line, step*(i)+1, options);
        // setIcongRotation(along1,along2,pointStyle);
        //获取两坐标角度
        var getAngle = function(lnglat,lnglat2) {
            var pi_90 = Math.atan2(1,0);
            var pi_xy = Math.atan2(lnglat2[1] - lnglat[1],lnglat2[0] - lnglat[0]);
            return pi_90 - pi_xy;
        };
        var angle = getAngle(along1.geometry.coordinates,along2.geometry.coordinates)
        marker.getStyle().getImage().setRotation(angle);
        // .setZIndex(99);
        marker.getGeometry().setCoordinates(along2.geometry.coordinates);
        if(i>num){
            window.clearInterval(interval)
        }
    },10)
}
