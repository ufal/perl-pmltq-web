angular.module('pmltq.result').factory('tredSvg', function ($, _, Snap, sentence) {

  var titleTreeRe = new RegExp('\\((\\d+)/(\\d+)\\)$');

  function parseTitle(str) {
    var matches = titleTreeRe.exec(str);
    matches.shift();
    return matches;
  }

  /**
   * Cleans up TrEd's svg and converts it to {Snap.Fragment}.
   * @param {string} svgString
   * @returns {Snap.Fragment}
   */
  function extractSvg(svgString) {
    // cleanup string
    svgString = svgString
      .replace(/<\?[\s\S]*?\?>/, '')
      .replace(/<svg[^>]*?>/mi, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">')
      .replace(/<script[^>]*?>[^]*?<\/script>/gmi, '');
    return Snap.parse(_.trim(svgString));
  }

  function parseNodeName (name) {
    name = name.substring(name.indexOf('/') + 1, name.length);
    var splitPos = name.indexOf('@'); // new syntax
    if (splitPos < 0) { splitPos = name.indexOf('+'); } // old syntax
    var id = name.substring(splitPos + 1, name.length);
    var type = name.substring(0, splitPos);
    return {id: id, type: type};
  }

  function extractNodeId (str, prefix) {
    var pos = str.indexOf(prefix);
    if (pos === -1) { return null; }

    str = str.substr(pos + 1);
    str = str.split(' ', 1);
    return str[0];
  }

  /**
   * @param {string} svg
   * @constructor
   */
  function TredSvg(svg) {
    this.svg = svg;
    this.data = {};
  }

  TredSvg.prototype = {
    /**
     * @returns {Snap.Fragment}
     * @public
     */
    content: function() {
      return _.isString(this.svg) ? (this.svg = extractSvg(this.svg)) : this.svg;
    },
    /**
     * @returns {jQuery}
     * @private
     */
    $content: function() {
      return _.isUndefined(this.$svg) ? (this.$svg = $(this.content().node)) : this.$svg;
    },
    /**
     * Get all tree nodes. Also fixes node classes.
     * @returns {Snap.Set}
     * @private
     */
    extractNodes: function() {
      var self = this;

      if (!self.nodes) {
        var snap = self.content();
        self.nodes = snap.selectAll('.node');
        self.nodesMap = {};

        self.nodes.forEach(function(node) {
          var nodeId = extractNodeId(node.attr('class'), '#');
          node.attr('class', 'node');
          if (nodeId) {
            self.nodesMap[nodeId] = node;
          }
        });
      }

      return self.nodes;
    },
    /**
     * Attach 'matched-node-*' classes specified nodes
     * @param {Array} nodes
     */
    highlightNodes: function(nodes) {
      var self = this;

      if (!nodes) { return; }
      self.extractNodes();

      var processed = {};
      for (var i = nodes.length - 1; i >= 0; i--) {
        var node = parseNodeName(nodes[i]),
            id = node.id;

        if (processed[id]) { continue; }

        processed[id] = true;
        id = id.replace(/([^-_A-Za-z0-9])/g, ''); // Not sure if this is needed
        var svgNode = self.nodesMap[id];
        if (svgNode) {
          svgNode.addClass('matched-node-' + (i + 1));
          svgNode.animate();
        }
      }
    },
    resize: function () {
      var self = this,
        content = self.content(),
        g = content.select('g'),
        box = g.getBBox();
      content.node.setAttribute('width', Math.round(box.width + 10));
      content.node.setAttribute('height', Math.round(box.height + 20));
    },
    sentence: function() {
      var self = this, data = self.data;

      if (_.isUndefined(data.sentence)) {
        var descNode = self.$content().children('desc').remove();
        data.sentence = sentence(descNode.find('span[class]'));
      }

      return data.sentence;
    },
    title: function() {
      var self = this, data = self.data;

      if (_.isUndefined(data.title)) {
        var title = self.$content().children('title');
        data.title = _.isEmpty(title) ? '' : title.text();
        if (!_.isEmpty(title)) {
          title.remove();
        }
      }

      return data.title;
    },
    tree: function() {
      var self = this, data = self.data;

      if (_.isUndefined(data.tree)) {
        var arr = parseTitle(self.title());
        data.tree = {
          current: parseInt(arr[0]),
          total: parseInt(arr[1])
        };
      }

      return data.tree;
    }
  };

  function TredSvgFactory (svgString) {
    return new TredSvg(svgString);
  }

  return TredSvgFactory;
});
