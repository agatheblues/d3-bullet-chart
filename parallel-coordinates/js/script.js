function randomise(numLines){
    return d3.range(numLines).map(function(i){
        return {
                a : Math.random()*100,
                b : Math.random()*5,
                c : Math.random()*10,
                d : Math.random()*15,
                e : Math.random()*5
            };
    });
}

var numLines = 10;
var dataset = randomise(numLines);
var numKeys = dataset[0] ? Object.keys(dataset[0]).length : 0; //Si dataset est vide; numkeys = 0

//Width and height
var w = 800;
var h = 450;
var padding = 25;

var svg = d3.select('#chart').append('svg')
                                .attr('width',w)
                                .attr('height',h);


svg.append('g')
    .attr('id','lineSet');

svg.append('g')
    .attr('id','axisSet');

svg.append('g')
    .attr('id','circleSet');

var lineFunction = d3.svg.line()
                      .x(function(d) { return d.x;})
                      .y(function(d) { return d.y;})
                     .interpolate("linear");

function update(dataset){
    if (numLines != 0){
        //Scale for each key
        function createScale(key){
            return  d3.scale.linear()
                                .domain([0,d3.max(dataset,function(d){return eval('d.' + key);})])
                                .range([2*padding,h-padding]);
        };

        //Axis
        var axis = svg.select('#axisSet').selectAll('.axis')
                         .data(Object.keys(dataset[0])); //mapping axis per keys in the dataset (ie 'a','b','c'...)

                    axis.enter()
                         .append('g')
                         .attr('class','axis')
                         .append('text')
                         .text(function(d){return d;})
                         .attr('y',padding);

                    axis.transition()
                        .duration(1000)
                        .attr('transform',function(d,i){return 'translate('+ (padding + i*(w-2*padding)/(numKeys-1))+')';})
                        .each(function(d){
                            d3.select(this).call(d3.svg.axis()
                                                .scale(createScale(d)) //for each key there is a specific scale
                                                .orient('left')
                                                .ticks(10));
                            });

                    axis.exit()
                        .remove();

        //Lines
        function reShapeData(dataset){
            //line() only works if you provide an array of coordinates[{x:,y:},{x:,y:}...]
            //so we reshape the dataset so that it reflects that structure
            //for each datum {a,b,c} : and for each key, we create [{x:,y:},{x:,y:}...] that contains the coordinates of ONE line
            //Coordinates are the different points on each axis. So x is calculated by counting on which axis it is
            //y is calculated with the scale for that key, on the value of that key
            //Ex : {x:padding,y:aScale(15)},{x:padding + width til next axis,y:bScale(20),{x:padding + 2*width til next axis,y:cScale(10)}...}
            var newDataset = [];
            dataset.forEach(function(group,indexGroup){
                newDataset.push([]);
                Object.keys(group).forEach(function(key,indexKey){
                    newDataset[indexGroup].push({x:padding + indexKey*(w-2*padding)/(numKeys-1), y:createScale(key)(group[key])});
                });
            });
            return newDataset;
        };

        var circleLine = svg.select('#circleSet').selectAll('.circleLine')
                                    .data(reShapeData(dataset))

                            circleLine.enter()
                                    .append('g')
                                    .attr('class','circleLine');

        //Circles
        var circles = svg.selectAll('.circleLine').selectAll('.circle')
                                    .data(function(d){return d;});


                    circles.enter()
                            .append('circle')
                            .attr('class','circle')
                            .attr('r','3px')
                            .attr('cx','0px')
                            .attr('cy',h-padding);

                circles.transition()
                            .duration(2000)
                            .delay(function(d,i){
                                return 500 + i*600;
                            })
                            .attr('cx',function(d){return d.x;})
                            .attr('cy',function(d){return d.y;});

        circleLine.exit()
                    .remove();

        var lines = svg.select('#lineSet').selectAll('.lines')
                                            .data(reShapeData(dataset));

                    lines.enter()
                            .append('path')
                            .attr('class','lines')
                            .attr('stroke','#111111')
                            .attr('stroke-opacity','0')
                            .attr('d','M'+padding+' '+(h/2)+' L'+(w-padding)+' '+(h/2)+'');

                    lines.transition()
                            .duration(2000)
                            .delay(function(d,i){
                                return i*500;
                            })
                            .attr('d',function(d){return lineFunction(d);})
                            .attr('stroke','#777777')
                            .attr('stroke-opacity','1');

                    lines.exit()
                            .remove();


    d3.selectAll('.lines').on('mouseover',function(){
        d3.selectAll('.lines').attr('stroke','#777777');
        d3.select(this).attr('stroke','#5500FF');
    });

    } else
    {alert("Dataset is empty :(");}
}

update(dataset);

//Randomise
d3.select('#randomise').on('click',function(){
    update(randomise(numLines));
});
//Number of lines
d3.select("#nData").on("input", function() {
    numLines=this.value;
    d3.select("#nData-value").text(numLines);
    d3.select("#nData").property("value", numLines);
    update(randomise(numLines));
});
