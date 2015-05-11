var firstDataset = [
  {
      "title":"Revenue",
      "subtitle":"US$, in thousands",
      "ranges":[150,225,300],
      "measures":[220,270],
      "markers":[250]
  },

  {"title":"Profit","subtitle":"%","ranges":[20,25,30],"measures":[21,23],"markers":[26]},
  //{"title":"Test","subtitle":"test","ranges":[100,200,300],"measures":[150,175],"markers":[26]},
  {"title":"Order Size","subtitle":"US$, average","ranges":[350,500,600],"measures":[100,320],"markers":[550]},
  {"title":"New Customers","subtitle":"count","ranges":[1400,2000,2500],"measures":[1000,1650],"markers":[2100]},
  {"title":"Satisfaction","subtitle":"out of 5","ranges":[3.5,4.25,5],"measures":[3.2,4.7],"markers":[4.4]}
];

function newRanges(){
    var maxRange = Math.random() * 100;
    var midRange = Math.round(Math.random() * maxRange);
    var minRange = Math.round(Math.random() * midRange);
    var maxMeasures = Math.round(Math.random() * maxRange);
    var minMeasures = Math.round(Math.random() * maxMeasures);

    return {
        ranges : [minRange,midRange,maxRange],
        measures :[minMeasures,maxMeasures],
        markers : [Math.round(Math.random() * maxRange)]
    };
}

function randomise(){
    firstDataset.forEach(function(item,indexItem){
        var newItem = newRanges();
        item['ranges'] = newItem.ranges;
        item['measures'] = newItem.measures;
        item['markers'] = newItem.markers;
    });
    return firstDataset;
}

function addNew(){
    var newItem = newRanges();
    newItem.title = 'A title';
    newItem.subtitle= 'A subtitle';
    firstDataset.push(newItem);
    return firstDataset;
}

function removeLast(){
    firstDataset.pop();
    return firstDataset;
}

// function print(t) { console.log(t); }

function main(){

    var w = 960;
    var h = 400;
    var padding = 15;
    var svg = d3.select('#chart')
                    .append('svg')
                    .attr('width',w)
                    .attr('height',h);

    svg.append('g')
        .attr('transform','translate('+ 0.2*w +')')
        .attr('id','bars');

    svg.append('g')
        .attr('id','labels');

    var colorScale = d3.scale.ordinal()
                                .domain([0,1])
                                .range(['#5AC95A','#387C38']);

    function bullets(dataset){
        //alignement des barres verticalement
        var yScaleRanges = d3.scale.ordinal()
                                .domain(d3.range(dataset.length))
                                .rangeRoundBands([padding,h-padding],0.40);

        var labels = svg.select('#labels').selectAll('.label')
                                            .data(dataset);

                                      labels.enter()
                                            .append('g')
                                            .attr('class','label');

                                      labels.transition()
                                            .duration(1000)
                                            .attr('transform',function(d,i){return 'translate('+(0.2*w-padding)+','+ (yScaleRanges(i) + yScaleRanges.rangeBand()/2)+')';});

                                      labels.exit()
                                            .remove();
        var titles = labels.append('text')
                            .attr('class','title')
                            .attr('height',function(d){return yScaleRanges.rangeBand();})
                            .attr('width',0.2*w)
                            .text(function(d){return d.title;});

        var subtitles = labels.append('text')
                                .attr('class','subtitle')
                                .attr('height',function(d){return yScaleRanges.rangeBand();})
                                .attr('width',0.2*w)
                                .attr('dy','13px')
                                .text(function(d){return d.subtitle;});

        //Each bar has a different scale; so the scale needs to change depending on the bar you're making
        //To know which bar we're dealing with; we look at the g parent index
        //This index is exactly the index of the datum inside the dataset
        //With this index we can retrieve the corresponding range and calculate the scale for that specific range
        //We don't return a value but the scale itself; because we need the scale function to populate the axis
        function widthDynScale(index){

            return widthScale = d3.scale.linear()
                                .domain([0,d3.max(dataset[index]['ranges'],function(d){return d;})])
                                .range([0,0.8*w-padding]);
        }

        //G group for one bar
        var mainBarGroup = svg.select('#bars').selectAll('.mainBar')
                                .data(dataset);

                                mainBarGroup.enter()
                                            .append('g')
                                            .attr('class','mainBar')
                                            .attr('index',function(d,i){return i;})

                                mainBarGroup.attr('transform',function(d,i){return 'translate(0,'+ yScaleRanges(i)+')';})
                                                .append('g') //Axes
                                                .attr('class','axis');

                                //Axis for one bar
                                mainBarGroup.select('.axis').transition()
                                                                .duration(1000)
                                                                // .delay(function(){
                                                                //     return (d3.select(this.parentNode).attr('index')*100); //Sinon il commence par les rect a partir de 0 et pas par groupe
                                                                // })
                                                                .attr('transform',function(d,i){return 'translate(0,'+ yScaleRanges.rangeBand() +')';})
                                                                .each(function(){ //Pour chaque axe on appelle axis
                                                                    d3.select(this).call(d3.svg.axis()
                                                                                    .scale(widthDynScale(d3.select(this.parentNode).attr('index'))) //scale du groupe de bar d'index 0 - 4
                                                                                    .orient('bottom')
                                                                                    .ticks(5));
                                                                });
                                mainBarGroup.exit()
                                            .remove();

        //Big grey rectangles
        var rangesRect = svg.selectAll('.mainBar').selectAll('.rangesRect')
                                                    .data(function(d){return d.ranges;});

                                        rangesRect.enter()
                                                    .append('rect')
                                                        .attr('class','rangesRect')
                                                        .attr('width','0px');

                                        rangesRect.transition()
                                                    .duration(1000)
                                                    // .delay(function(){
                                                    //     return (d3.select(this.parentNode).attr('index')*200); //Sinon il commence par les rect a partir de 0 et pas par groupe
                                                    // })
                                                    .attr('height',function(d){return yScaleRanges.rangeBand();})
                                                    .attr('width',function(d){return widthDynScale(d3.select(this.parentNode).attr('index'))(d);});


        //Nested green rectangles
        var measuresRect = svg.selectAll('.mainBar').selectAll('.measuresRect')
                                                    .data(function(d){return d.measures.sort(d3.descending);});

                                        measuresRect.enter()
                                                    .append('rect')
                                                        .attr('class','measuresRect')
                                                        .attr('width','0px')
                                                        .attr('fill',function(d,i){return colorScale(i);});

                                        measuresRect.transition()
                                                    .duration(1000)
                                                    // .delay(function(){
                                                    //     return (d3.select(this.parentNode).attr('index')*200); //Sinon il commence par les rect a partir de 0 et pas par groupe
                                                    // })
                                                    .attr('y',yScaleRanges.rangeBand()/2-yScaleRanges.rangeBand()/6)
                                                    .attr('height',yScaleRanges.rangeBand()/3)
                                                    .attr('width',function(d){return widthDynScale(d3.select(this.parentNode).attr('index'))(d);});

        //Black markers
        var markers = svg.selectAll('.mainBar').selectAll('.markers')
                                                    .data(function(d){return d.markers;})

                                            markers.enter()
                                                    .append('rect')
                                                        .attr('class','markers')
                                                        .attr('width','2px')
                                                        .attr('x','0px');

                                            markers.transition()
                                                    .duration(1000)
                                                    // .delay(function(){
                                                    //     return (d3.select(this.parentNode).attr('index')*200); //Sinon il commence par les rect a partir de 0 et pas par groupe
                                                    // })
                                                    .attr('y',yScaleRanges.rangeBand()/2-yScaleRanges.rangeBand()/4)
                                                    .attr('height',yScaleRanges.rangeBand()/2)
                                                    .attr('x',function(d){return widthDynScale(d3.select(this.parentNode).attr('index'))(d);});
    }

    //First Display
    bullets(firstDataset);

    d3.select('#randomise').on('click',function(){
        bullets(randomise());
    });

    d3.select('#add').on('click',function(){
        bullets(addNew());
    });

    d3.select('#delete').on('click',function(){
        bullets(removeLast());
    });
}
