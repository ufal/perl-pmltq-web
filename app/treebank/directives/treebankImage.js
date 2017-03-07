var _ = require('lodash');
var $ = require('jquery');

module.exports = function($cacheFactory, $timeout) {
  //noinspection BadExpressionStatementJS
  'ngInject';

  var maxFontSize = 120,
    sizeCache = $cacheFactory('treebank-logo-size-cache'),
    imageCache = $cacheFactory('treebank-logo-cache');

  function testLine(line, maxWidth, property, size, interval, units, previousWidth) {
    previousWidth = _.isNumber(previousWidth) ? previousWidth : 0;
    line.css(property, size + units);
    var width = line.width();

    if (width >= maxWidth) {
      line.css(property, '');

      if (width === maxWidth) {
        return {
          match: 'exact',
          size: parseFloat((parseFloat(size) - 0.1).toFixed(3))
        };
      }

      // Since this is an estimate, we calculate how far over the width we went with the new value.
      // If this is word-spacing (our last resort guess) and the over is less than the under, we keep the higher value.
      // Otherwise, we revert to the underestimate.
      var under = maxWidth - previousWidth,
        over = width - maxWidth;

      return {
        match: 'estimate',
        size: parseFloat((parseFloat(size) - (property === 'word-spacing' && previousWidth && (over < under) ?
          0 : interval)).toFixed(3))
      };
    }

    return width;
  }

  function calcFontSize(line, fontSize, maxWidth) {
    var intervals = [8, 4, 1], lineMax = 0;

    for (var i = 0; i < intervals.length; i++) {
      var interval = intervals[i];
      for (var j = 0; j < 10; j++) {
        if (fontSize + j * interval > maxFontSize) {
          return maxFontSize;
        }

        lineMax = testLine(line, maxWidth, 'font-size', fontSize + j * interval, interval, 'px', lineMax);
        if (!_.isNumber(lineMax)) {
          fontSize = lineMax.size;

          if (lineMax.match === 'exact') {
            return fontSize;
          }

          break;
        }
      }
    }

    return fontSize;
  }

  function setLineSizes(line, maxWidth) {
    var text = line.data('text'),
      cacheKeyId = text + maxWidth,
      fontSize = sizeCache.get(cacheKeyId);
    if (!fontSize) {
      var autoGuessSubtraction = 32,
        currentFontSize = parseFloat(line.css('font-size')),
        ratio = (line.width() / currentFontSize).toFixed(6),
        newFontSize = parseInt(maxWidth / ratio, 10) - autoGuessSubtraction;

      fontSize = calcFontSize(line, newFontSize, maxWidth);
      sizeCache.put(cacheKeyId, fontSize);
    }

    line.css({fontSize: fontSize});
  }

  function treebankImage(element, width) {
    var children = element.children();

    for (var i = 0; i < children.length; i++) {
      setLineSizes($(children[i]), width);
    }
  }

  return {
    restrict: 'A',
    scope: {
      image: '=treebankImage',
      width: '@imageWidth'
    },
    link: function($scope, $element) {
      var lastWidth = 0;

      function renderImage(image, width) {
        if (lastWidth === width || width === 0) {
          return;
        }

        var cacheKey = image.text.join('') + 'w' + width,
          cached  = imageCache.get(cacheKey);
        $element.empty();
        if (!cached) {
          var max = image.text.length > 2 ? 2 : image.text.length;
          for (var i = 0; i < max; i++) {
            var text = image.text[i];
            $element.append($('<span></span>').html(text.replace(/ /g, '&nbsp;')).data('text', text));
          }
          treebankImage($element, width);
          imageCache.put(cacheKey, $element.html());
        } else {
          $element.append(cached);
        }

        lastWidth = width;
      }

      $scope.$watch('image', function(image) {
        if (!image) {
          return;
        }

        $timeout(function () {
          renderImage(image, $scope.width);
        });
      });
    }
  };
};
