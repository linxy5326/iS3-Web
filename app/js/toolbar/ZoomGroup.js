/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */
/* globals iS3Project */
/* globals ol */

/**
 * Construction function
 *
 * @param {Object} options Options
 * @constructor
 */
iS3.toolbar.ZoomGroup = function (options) {

    iS3.ToolGroup.call(this, options);

    this.parentObj = options.parentObj;
    this.layertree = options.parentObj.layertree;
    this.init();
};
iS3.inherits(iS3.toolbar.ZoomGroup, iS3.ToolGroup);

/**
 * Initializaiton function
 */
iS3.toolbar.ZoomGroup.prototype.init = function () {
    var thisCpy = this;
    var layertree = this.layertree;

    /*
     layertree.selectEventEmitter.on('change', function () {
     var layer = layertree.getLayerById(layertree.selectedLayer.id);
     if (layer instanceof ol.layer.Vector) {
     thisCpy.getTools()[1].setDisabled(false);
     thisCpy.getTools()[2].setDisabled(false);
     } else {
     thisCpy.getTools()[1].setDisabled(true);
     thisCpy.getTools()[2].setDisabled(true);
     }
     }, this);
     */

    this.loadZoomFull().loadZoomToLayer().loadZoomToSelected();
};

/**
 * Load zoom full
 *
 * @return {iS3.toolbar.ZoomGroup} Group
 */
iS3.toolbar.ZoomGroup.prototype.loadZoomFull = function () {
    var zoomFull = new ol.control.ZoomToExtent({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.zoomToFullTip
    });
    zoomFull.id = 'zoomFull';
    this.add(zoomFull);
    return this;
};

/**
 * Load zoom to layer
 *
 * @return {iS3.toolbar.ZoomGroup} Group
 */
iS3.toolbar.ZoomGroup.prototype.loadZoomToLayer = function () {
    var layertree = this.layertree;
    var thisCpy = this;
    var extent = null;
    var zoomToLayer = new iS3.toolbar.BasicControl({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.zoomToLayerTip,
        className: 'ol-zoom-layer ol-unselectable ol-control',
        trigger: function () {
            if (!layertree.selectedLayer) {
                thisCpy.parentObj.message.textContent = 'Please select a layer';
                return null;
            }
            var layer = layertree.getLayerById(layertree.selectedLayer.id);
            if (layer instanceof ol.layer.Tile) {
                var layerDef = layertree.getLayerDefById(layertree.selectedLayer.id);
                var extentOrigin = [];
                if (layerDef.projection.getCode().indexOf('4326') !== -1) {
                    extentOrigin.push(layerDef.extent[1]);
                    extentOrigin.push(layerDef.extent[0]);
                    extentOrigin.push(layerDef.extent[3]);
                    extentOrigin.push(layerDef.extent[2]);
                    console.log(extentOrigin);
                } else {
                    extentOrigin = layerDef.extent;
                }
                extent = ol.proj.transformExtent(extentOrigin, layerDef.projection,
                    layertree.map.getView().getProjection());

            } else if (layer instanceof ol.layer.Vector) {
                var source = layer.getSource();
                if (source.getExtent()) {
                    extent = source.getExtent();
                }
            }
            if (extent instanceof ol.geom.SimpleGeometry
                || (Object.prototype.toString.call(extent) === '[object Array]'
                && extent.length === 4)) {
                layertree.map.getView().fit(extent, layertree.map.getSize());
            }
        }
    });
    zoomToLayer.id = 'zoomToLayer';
    this.add(zoomToLayer);
    return this;
};

/**
 * Load zoom to selected
 *
 * @return {iS3.toolbar.ZoomGroup} Group
 */
iS3.toolbar.ZoomGroup.prototype.loadZoomToSelected = function () {
    var thisCpy = this;
    var layertree = this.layertree;
    var extent = ol.extent.createEmpty();
    var zoomToSelected = new iS3.toolbar.BasicControl({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.zoomToSelectedTip,
        className: 'ol-zoom-selected ol-unselectable ol-control',
        trigger: function () {
            if (thisCpy.parentObj.selectInteraction.getFeatures().getArray().length === 0) {
                thisCpy.parentObj.message.textContent = 'Please select a layer';
                return null;
            }
            var features = thisCpy.parentObj.selectInteraction.getFeatures();
            for (var i = 0; i < features.getLength(); i++) {
                var geom = features.item(i).getGeometry();
                if (geom instanceof ol.geom.SimpleGeometry) {
                    extent = ol.extent.extend(extent, geom.getExtent());
                }
            }
            if (extent instanceof ol.geom.SimpleGeometry
                || (Object.prototype.toString.call(extent) === '[object Array]'
                && extent.length === 4)) {
                layertree.map.getView().fit(extent, layertree.map.getSize());
            }
        }
    });
    zoomToSelected.id = 'zoomToSelected';
    this.add(zoomToSelected);
    return this;
};