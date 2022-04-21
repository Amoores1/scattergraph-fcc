let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let req = new XMLHttpRequest()

let values = []

let yScale
let xScale
let xAxisScale
let yAxisScale

let width = 600
let height = 400
let padding = 40

let svg = d3.select("svg")
let after = d3.select("div")
let tooltip = d3.select("#tooltip")

let drawCanvas = () => {
    svg.attr("width", width)
    svg.attr("height", height)
}

let generateScales = () => {
    
    xScale = d3.scaleLinear()
                .range([padding, width-padding])
                .domain([d3.min(values, (item)=>{
                    return item['Year']
                }) -1, d3.max(values, (item)=> {
                    return item['Year']
                })+1])

    yScale = d3.scaleTime()
                .range([padding, height - padding])
                .domain([d3.min(values, (item)=>{
                    return new Date(item['Seconds']*1000 -10000)
                }), d3.max(values, (item)=> {
                    return new Date(item['Seconds']*1000 +10000)
                })])
}

let generateAxes = () => {

    let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
    let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'))

    svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0, ' + (height-padding) + ')')

    svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding + ', 0)')
}

let drawPoints = () => {
    svg.selectAll('circle')
        .data(values)
        .enter()
        .append('circle')
        .attr('class','dot')
        .attr('r', '5')
        .attr('data-xvalue', (item) => {
            return item['Year']
        })
        .attr('data-yvalue', (item) => {
            return new Date(item['Seconds']*1000)
        })
        .attr('cx', (item)=>{
            return xScale(item['Year'])
        })
        .attr('cy', (item)=>{
            return yScale(new Date(item['Seconds']*1000))
        })
        .attr('fill', (item) => {
            if(item['Doping'] != ""){
                return 'red'
            } else {return 'green'} 
        })
        .on('mouseover', (item) => {
            tooltip.transition()
                .style('visibility', 'visible')

            if(item['Doping'] != "") {
                tooltip.text(item["Name"] + ' - ' + item['Year'] + ' - ' + item['Time'] + ' - ' + item['Doping'])
            }else {
                tooltip.text(item["Name"] + ' - ' + item['Year'] + ' - ' + item['Time'] + ' - No doping allegations')
            }
            tooltip.attr("data-year", item["Year"])
        })
        .on('mouseout', (item)=> {
            tooltip.transition()
            .style('visibility', 'hidden')
        })
}

let legendDiv = () => {
    after
    .append('div')
    .attr('id','legend')
    .append('text')
    .text("Red = Dope | Green = Clean")
}

req.open("GET", url, true)
req.onload = () => {
    values = JSON.parse(req.responseText)
    console.log(values)
    drawCanvas()
    generateScales()
    generateAxes()
    drawPoints()
    legendDiv()
}
req.send()