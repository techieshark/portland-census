(function() {

  window.__mappings = {
    'Total population': function(d) {
      return d.b01001e1;
    },
    'White population': function(d) {
      return d.b02001e2;
    },
    'Black population': function(d) {
      return d.b02001e3;
    },
    'Hispanic population': function(d) {
      return d.b03002e12;
    },
    'Asian population': function(d) {
      return d.b02001e5;
    },
    'Percent white': function(d) {
      return d.b02001e2 / d.b01001e1 * 100;
    },
    'Percent black': function(d) {
      return d.b02001e3 / d.b01001e1 * 100;
    },
    'Percent hispanic': function(d) {
      return d.b03002e12 / d.b01001e1 * 100;
    },
    'Percent biking to work': function(d) {
      return d.b08301e18 / d.b08301e1 * 100;
    },
    'Travel hour or more to work': function(d) {
      return d.b08303e12 + d.b08303e13;
    },
    'Two or more vehicles': function(d) {
      return d.b25044e5 + d.b25044e6 + d.b25044e7 + d.b25044e8;
    },
    'Living in poverty': function(d) {
      return d.b17017e1;
    },
    'Median household Income': function(d) {
      return d.b19013e1;
    },
    'Receive public assistance': function(d) {
      return d.b19057e2;
    },
    'Households > $200k income': function(d) {
      return d.b19001e17;
    },
    'Percentage of vacant housing units': function(d) {
      return d.b25004e1 / d.b25001e1 * 100;
    }
  };

}).call(this);
(function() {
  var formatSymbol, render, scaleForRetina;

  render = function() {
    var colors, fill, gridWidth, height, path, projection, width;
    width = $(document.body).width();
    height = 280;
    gridWidth = Math.round(width / 4) - 41;
    colors = ['#1a1a1a', '#353535', '#555', '#757575', '#959595', '#b5b5b5', '#d5d5d5', '#f5f5f5'];
    fill = d3.scale.quantile().range(colors);
    projection = d3.geo.albers().scale(1).translate([0, 0]);
    path = d3.geo.path().projection(projection);
    return d3.json('data/pdx.json', function(pdx) {
      var b, blockgroups, items, parks, s, t, water;
      $('.js-loading').hide();
      items = d3.select('.js-grid').selectAll('.item').data(d3.entries(__mappings)).enter().append('div').attr('class', 'item');
      items.append('h3').attr('class', 'title').text(function(d) {
        return d.key;
      });
      blockgroups = topojson.feature(pdx, pdx.objects.pdx);
      water = topojson.feature(pdx, pdx.objects.water);
      parks = topojson.feature(pdx, pdx.objects.parks);
      projection.scale(1).translate([0, 0]);
      b = path.bounds(blockgroups);
      s = .99 / Math.max((b[1][0] - b[0][0]) / gridWidth, (b[1][1] - b[0][1]) / height);
      t = [(gridWidth - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
      projection.scale(s).translate(t);
      return items.each(function(mapping) {
        var blockgroup, canvas, context, extent, legend, quantiles, val, _i, _len, _ref;
        canvas = d3.select(this).append('canvas').attr('width', gridWidth).attr('height', height);
        context = canvas.node().getContext('2d');
        scaleForRetina(canvas, context);
        path.context(context);
        extent = d3.extent(blockgroups.features, function(d) {
          return mapping.value.call(this, d.properties);
        });
        fill.domain(extent);
        _ref = blockgroups.features;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          blockgroup = _ref[_i];
          val = mapping.value.call(this, blockgroup.properties);
          context.beginPath();
          context.fillStyle = fill(val);
          context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          context.lineWidth = 0.2;
          path(blockgroup);
          context.fill();
          context.stroke();
        }
        context.beginPath();
        path(water);
        context.fillStyle = '#151515';
        context.fill();
        context.beginPath();
        path(parks);
        context.fillStyle = '#151515';
        context.fill();
        legend = d3.select(this).append('ol').attr('class', 'legend').style('width', "" + gridWidth + "px");
        quantiles = fill.quantiles();
        return legend.selectAll('.value').data(quantiles).enter().append('li').attr('class', 'value').style('background', function(d, i) {
          return colors[i + 1];
        }).append('span').text(function(d, i) {
          var v;
          v = formatSymbol(Math.round(d));
          if (i === 0) {
            return "<" + v;
          } else if (i === quantiles.length - 1) {
            return "" + v + "+";
          } else {
            return v;
          }
        }).style('visibility', function(d, i) {
          if (i % 3 && i !== quantiles.length - 1) {
            return 'hidden';
          }
        });
      });
    });
  };

  formatSymbol = function(number) {
    var pf;
    if (number < 1e+3) {
      return number;
    }
    pf = d3.formatPrefix(number);
    return "" + (pf.scale(number).toFixed(1)) + pf.symbol;
  };

  scaleForRetina = function(canvas, context) {
    var backingStoreRatio, devicePixelRatio, height, ratio, width;
    width = $(canvas.node()).width();
    height = $(canvas.node()).width();
    devicePixelRatio = window.devicePixelRatio || 1;
    backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
    ratio = devicePixelRatio / backingStoreRatio;
    if (window.devicePixelRatio !== backingStoreRatio) {
      canvas.attr('width', width * ratio).attr('height', height * ratio).style('width', width + 'px').style('height', height + 'px');
      return context.scale(ratio, ratio);
    }
  };

  $(render);

}).call(this);
(function() {



}).call(this);
