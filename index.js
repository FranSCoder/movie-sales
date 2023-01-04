const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
const width = 1100;
const height = 525;

const moneyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

const chart = d3.select('#chart')

chart
    .append('h1')
    .attr('id', 'title')
    .text('Movie Sales')

chart
    .append('h3')
    .attr('id', 'description')
    .text('Top 100 Movies by Sales Revenue (US Domestic Data)')

const tooltip = chart
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);

const svg = chart
    .append('svg')
    .attr('id', 'main-square')
    .attr('width', width)
    .attr('height', height)

const color = d3.scaleOrdinal(d3.schemeAccent)

const treemap = d3.treemap().size([width, height]).paddingInner(2)

d3.json(url)
    .then((data) => callback(data))
    .catch((err) => console.log(err));

//Callback function

function callback(data) {

//Sets the data hierarchy so the treemap() method can handle it

    const root = d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value);

    treemap(root)

//Cells

    const cell = svg
        .selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', (d) => 'translate(' + d.x0 + ', ' + d.y0 + ')')

    cell
        .append('rect')
        .attr('class', 'tile')
        .attr('data-name', (d) => d.data.name)
        .attr('data-category', (d) => d.data.category)
        .attr('data-value', (d) => d.data.value)
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('fill', (d) => color(d.data.category))
        .on('mousemove', (event, d) => {
            tooltip.style('opacity', 0.9);
            tooltip
                .html(
                    'Movie: ' +
                    d.data.name +
                    '<br>Genre: ' +
                    d.data.category +
                    '<br>Sales: ' +
                    moneyFormatter.format(d.data.value)
                )
              .attr('data-value', d.data.value)
              .style('left', event.pageX + 'px')
              .style('top', event.pageY - 80 + 'px');
          })
          .on('mouseout', function () {
            tooltip.style('opacity', 0);
          });

    cell
        .append("foreignObject")
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .append("xhtml:div")
        .attr('class', 'movie-name')
        .html((d) => d.data.name)

    //Legend

    const categories = [...new Set(
        root.leaves()
            .map((d) => d.data.category)
    )]

    const legend = chart
        .append('svg')
        .attr('id', 'legend')
        .attr('width', width - 100)
        .attr('height', 48)
        

    const legendElement = legend
        .selectAll('g')
        .data(categories)
        .enter()
        .append('g')
        .attr('transform', (d, i) => 'translate(' + i * ((width - 100) / 7) + ', ' + 16 + ')')

    legendElement
        .append('rect')
        .attr('width', 16)
        .attr('height', 16)
        .attr('stroke', 'black')
        .attr('class', 'legend-item')
        .attr('fill', (d) => color(d))

    legendElement
        .append('text')
        .attr('x', 20)
        .attr('y', 13)
        .attr('fill', 'silver')
        .text((d) => d)
}