/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */
/* globals ol */
/* globals jsts */

/**
 * The constructor function
 */
iS3.topology = function () {

};

iS3.topology.geometryFactory = new jsts.geom.GeometryFactory();

iS3.topology.ParserConstructor = jsts.io.olParser;
iS3.topology.parser = new iS3.topology.ParserConstructor();

/**
 * Check if the OpenLayer geometry intersects
 *
 * @param {ol.geom} polygeomA The ol geometry
 * @param {ol.geom} polygeomB The ol geometry
 * @return {boolean} The result
 */
iS3.topology.polyIntersectsPoly = function (polygeomA, polygeomB) {
    var geomA = iS3.topology.parser.read(polygeomA);
    var geomB = iS3.topology.parser.read(polygeomB);
    return geomA.intersects(geomB);
};

/**
 * Transform true length to a map length
 *
 * @param {number} lengthTrue The length in true world
 * @return {number} The map length
 */
iS3.topology.trueDist2MapDist = function (lengthTrue) {
    var line = new ol.geom.LineString([[0, 0], [0, lengthTrue]]);
    line.transform(ol.proj.get('EPSG:3857'), window.iS3Project.getMap().getView().getProjection());
    return line.getLength();
};