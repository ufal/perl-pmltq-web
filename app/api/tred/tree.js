/** @type _ */
var _ = require('lodash');
/** @type jQuery */
var $ = require('jquery');
/** @type Snap */
var Snap = require('snapsvg');
/** @type Rx  */
var Rx = require('rx');

var sentenceFactory = require('./sentence');

function parseNodeName(name) {
  name = name.substring(name.indexOf('/') + 1, name.length);
  var splitPos = name.indexOf('@'); // new syntax
  if (splitPos < 0) {
    splitPos = name.indexOf('+');
  } // old syntax
  var id = name.substring(splitPos + 1, name.length);
  var type = name.substring(0, splitPos);
  return {id: id, type: type};
}

function extractNodeId(str, prefix) {
  var pos = str.indexOf(prefix);
  if (pos === -1) {
    return null;
  }

  str = str.substr(pos + 1);
  str = str.split(' ', 1);
  return str[0];
}

/**
 * @param {Snap.Element} node
 */
function animateNode(node) {
  var mark = createNodeMark(node);
  mark.attr({
    fill: 'none',
    stroke: 'red',
    strokeWidth: 2
  });
  node.parent().append(mark);

  mark.animate({rx: '*=2', ry: '*=2', r: '*=2', opacity: 0}, 1000, window.mina.easein, function () {
    mark.remove();
  });
}

/**
 * Creates mark element (Ellipse or Circle)
 * @param {Snap.Element} node
 * @return {Snap.Element}
 */
function createNodeMark(node) {
  var bbox = node.getBBox();

  switch (node.type) {
    case 'rect':
    case 'ellipse':
      return node.paper.ellipse(bbox.cx, bbox.cy, bbox.w + 5, bbox.h + 5);
    // case 'circle':
    default:
      return node.paper.circle(bbox.cx, bbox.cy, bbox.r0 + 5);
  }
}

class TredTree {

  /**
   * Init new tree with svg fragment
   * @param {Snap.Element} svgFragment
   */
  constructor(svgFragment) {
    this.fragment = svgFragment;
    this.svg = $(svgFragment.node);

    this.nodeClick = new Rx.Subject();
    this.nodeHover = new Rx.Subject();

    this._markedNodes = {};
    this.markedNodes = new Rx.BehaviorSubject([]);
  }

  /**
   * Get all tree nodes. Also fixes node classes.
   * @returns {Snap.Set}
   * @private
   */
  extractNodes() {
    if (!this.nodes) {
      var fragment = this.fragment;
      this.nodes = fragment.selectAll('.node');
      this.nodesMap = {};

      this.nodes.forEach((element) => {
        var nodeId = extractNodeId(element.attr('class'), '#');
        element.attr('class', 'node');
        if (nodeId) {
          this.nodesMap[nodeId] = element;
          element.data('nodeId', nodeId);
        }

        this.attachNodeEvents(element);
      });
    }

    return this.nodes;
  }

  reattachEvents() {
    if (this.nodes) {
      this.nodes.forEach((element) => {
        this.attachNodeEvents(element);
      });
    } else {
      this.extractNodes();
    }
  }

  /**
   * @param {Snap.Element} element
   * @private
   */
  attachNodeEvents(element) {
    var el = $(element.node);

    Rx.Observable.fromEvent(el, 'click')
      .subscribe(() => {
        this.nodeClick.onNext(element);
        if (!element.data('marked')) {
          this.markNode(element);
        } else {
          this.unmarkNode(element);
        }
      });

    Rx.Observable.merge(Rx.Observable.fromEvent(el, 'mouseenter'), Rx.Observable.fromEvent(el, 'mouseleave'))
      .do((ev) => {
        ev.data = element.data();
      })
      .subscribe(this.nodeHover);
  }

  /**
   * @param {Snap.Element} node
   * @private
   */
  markNode(node) {
    var self = this,
      nodeId = node.data('nodeId');

    if (self._markedNodes[nodeId]) {
      return;
    }

    var mark = self._markedNodes[nodeId] = createNodeMark(node);
    mark.attr({
      fill: 'none',
      stroke: 'red',
      strokeWidth: 2
    });
    node.parent().append(mark);
    node.data('marked', true);

    this.updateMarkedNodes();
  }

  /**
   * @param {Snap.Element} node
   * @private
   */
  unmarkNode(node) {
    var self = this,
      nodeId = node.data('nodeId');

    if (!self._markedNodes[nodeId]) {
      return;
    }

    self._markedNodes[nodeId].remove();
    node.data('marked', false);
    delete self._markedNodes[nodeId];
    this.updateMarkedNodes();
  }

  updateMarkedNodes() {
    this.markedNodes.onNext(_.keys(this._markedNodes));
  }

  /**
   * Attach 'matched-node-*' classes specified nodes
   * @param {Array} nodes
   */
  highlightNodes(nodes) {
    if (!nodes) {
      return;
    }
    this.extractNodes();

    var processed = {};
    for (var i = nodes.length - 1; i >= 0; i--) {
      var node = parseNodeName(nodes[i]),
        id = node.id;

      if (processed[id]) {
        continue;
      }

      processed[id] = true;
      id = id.replace(/([^-_A-Za-z0-9])/g, ''); // Not sure if this is needed
      var svgNode = this.nodesMap[id];
      if (svgNode) {
        svgNode.addClass('matched-node-' + (i + 1));
        // TODO: replace with better animation
        animateNode(svgNode);
      }
    }
  }

  animateNodes(nodeIds) {
    if (!nodeIds) {
      return;
    }
    this.extractNodes();

    for (var i = 0; i < nodeIds.length; i++) {
      var nodeId = nodeIds[i],
        node = this.nodesMap[nodeId];
      if (node) {
        animateNode(node);
      }
    }
  }

  resize() {
    var fragment = this.fragment,
      g = fragment.select('g'),
      box = g.getBBox();
    fragment.node.setAttribute('width', Math.round(box.width + 10));
    fragment.node.setAttribute('height', Math.round(box.height + 20));
  }

  /**
   * @return {sentence}
   */
  get sentence() {
    if (_.isUndefined(this._sentence)) {
      var descNode = this.svg.children('desc').remove();
      this._sentence = sentenceFactory(descNode.find('span[class]'), this);
    }

    return this._sentence;
  }
}

module.exports = TredTree;
