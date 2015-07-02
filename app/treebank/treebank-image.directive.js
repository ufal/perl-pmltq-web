angular.module('pmltq.treebank').directive('treebankImage', function($cacheFactory, _, $) {
  var maxFontSize = 70, sizeCache = $cacheFactory('treebank-logo-size-cache');

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

  function treebankImage(element) {
    var maxWidth = element.width(),
      children = element.children();

    for (var i = 0; i < children.length; i++) {
      setLineSizes($(children[i]), maxWidth);
    }
  }

  return {
    restrict: 'A',
    scope: {
      image: '=treebankImage'
    },
    link: function($scope, $element) {
      $scope.$watch('image', function(image) {
        $element.empty();
        if (image) {
          var max = image.text.length > 2 ? 2 : image.text.length;
          for (var i = 0; i < max; i++) {
            var text = image.text[i];
            $element.append($('<span></span>').text(text).data('text', text));
          }
          treebankImage($element, image.text);
        }
      });
    }
  };
});
