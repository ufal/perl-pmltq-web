var _ = require('lodash');
var $ = require('jquery');
/** @type Rx  */
var Rx = require('rx');
var Snap = require('snapsvg-cjs');
var TredTree = require('./tree');

module.exports = function () {
  'ngInject';
  var titleTreeRe = new RegExp('\\((\\d+)/(\\d+)\\)$');

  function parseTitle(str) {
    var matches = titleTreeRe.exec(str);
    if (!matches) {
      return [1, 1];
    }
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
    var fragment = Snap.parse(_.trim(svgString));
    fragment.select('g').node.removeAttribute('transform');

    var $fragment = $(fragment.node);
    var titleEl = $fragment.children('title');
    var titleText = _.isEmpty(titleEl) ? '' : titleEl.text();
    var filename = titleText.replace(titleTreeRe, '').trim();
    var parsedTitle = titleText ? parseTitle(titleText) : [];

    if (titleEl) {
      titleEl.remove();
    }

    return {
      fragment: fragment,
      filename: filename,
      tree: parseInt(parsedTitle[0]),
      totalTrees: parseInt(parsedTitle[1])
    };
  }

  class TredSvgFile {
    constructor(treebank, address, filename, totalTrees) {
      this._filename = filename;
      this.totalTrees = totalTrees;
      this._trees = {};

      this.tree = new Rx.ReplaySubject(1);
      this.treeNoRx = new Rx.Subject();

      this.treeNoRx
        .flatMap((tree) => {
          this._treeNo = tree;
          var tredTree = this._trees[tree - 1];
          if (!tredTree) {
            return Rx.Observable.fromPromise(treebank.loadSvgTree(address, tree).then(svg => {
              var extracted = extractSvg(svg);
              return this.setTreeSvg(tree, extracted.fragment);
            }));
          } else {
            return Rx.Observable.return(tredTree);
          }
        })
        .subscribe((tree) => {
          this.tree.onNext(tree);
        });
    }

    setTreeSvg(treeNo, treeSvg) {
      var tree = this._trees[treeNo - 1];
      if (!tree) {
        tree = this._trees[treeNo - 1] = new TredTree(treeSvg);

        if (_.size(this._trees) === 1) {
          this.treeNo = treeNo; // Auto init first tree
        }
      }

      return tree;
    }

    get treeNo() {
      return this._treeNo;
    }

    set treeNo(treeNo) {
      if (treeNo >= 1 && treeNo <= this.totalTrees) {
        this.treeNoRx.onNext(treeNo);
      }
    }

    get filename() {
      return this._filename;
    }

    get hasNextTree() {
      return this.treeNo < this.totalTrees;
    }

    nextTree() {
      this.treeNo = this.treeNo + 1;
    }

    get hasPrevTree() {
      return this.treeNo > 1;
    }

    prevTree() {
      this.treeNo = this.treeNo - 1;
    }
  }

  ///**
  // * @param {string} svg
  // * @constructor
  // */
  //function TredSvgFile(svg) {
  //
  //}
  //
  //TredSvgFile.prototype = {
  //  /**
  //   * @returns {Snap.Fragment}
  //   * @public
  //   */
  //  content: function() {
  //    return _.isString(this.svg) ? (this.svg = extractSvg(this.svg)) : this.svg;
  //  },
  //  /**
  //   * @returns {jQuery}
  //   * @private
  //   */
  //  $content: function() {
  //    return _.isUndefined(this.$svg) ? (this.$svg = $(this.content().node)) : this.$svg;
  //  },
  //
  //  title: function(original) {
  //    var self = this, data = self.data;
  //
  //    if (_.isUndefined(data.title)) {
  //      var title = self.$content().children('title');
  //      data.titleOriginal = _.isEmpty(title) ? '' : title.text();
  //      data.title = data.titleOriginal.replace(titleTreeRe, '').trim();
  //      if (!_.isEmpty(title)) {
  //        title.remove();
  //      }
  //    }
  //
  //    return original ? data.titleOriginal : data.title;
  //  },
  //  tree: function() {
  //    var self = this, data = self.data;
  //
  //    if (_.isUndefined(data.tree)) {
  //      var arr = parseTitle(self.filename(true));
  //      data.tree = {
  //        current: parseInt(arr[0]),
  //        total: parseInt(arr[1])
  //      };
  //    }
  //
  //    return data.tree;
  //  },
  //  currentTree: function () {
  //    return this.tree().nodeAddress;
  //  },
  //  treeCount: function () {
  //    return this.tree().total;
  //  },
  //  prevTree: function () {
  //    var tree = this.tree();
  //    return tree.nodeAddress - 1;
  //  },
  //  nextTree: function () {
  //    var tree = this.tree();
  //    return tree.nodeAddress + 1;
  //  }
  //};

  function TredSvgFileFactory(treebank, address, svgString) {
    var extracted = extractSvg(svgString);

    var file = new TredSvgFile(treebank, address, extracted.filename, extracted.totalTrees);
    file.setTreeSvg(extracted.tree, extracted.fragment);

    return file;
  }

  return TredSvgFileFactory;
};
