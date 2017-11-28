import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

/**
 * A component for displaying a histogram with the distribution of the total requested time.
 *
 * The following properties can be passed to this component.
 *
 * width: The width of the chart, including margins, in pixels. (optional)
 * height: The height of the chart, including margins, in pixels. (optional)
 * margin: The margin around the chart, with properties "top", "bottom", "left" and "right". (optional)
 * proposals: The list of proposals. Each proposal must have a property "totalTime" (with the total time requested
 *            from all partners) and a property "partnerTime" (with the total time requested from a partner).
 *
 * The histogram contains bars for the time requested from all partners and for the time requested from a partner.
 * Their CSS classes are "total time" and "partner time".
 */
class TotalTimeDistribution extends React.Component {
    componentDidMount() {
        this.createPlot();
    }

    componentDidUpdate() {
        this.createPlot();
    }

    createPlot = () => {
        const svg = d3.select(this.target);

        // remove any existing plot content
        svg.selectAll('*').remove();

        // set up the geometry, using the margin pattern
        const width = svg.attr('width');
        const height = svg.attr('height');
        const margin = this.props.margin || {
            top: 20,
            bottom: 60,
            left: 65,
            right: 20
        };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const g = svg.append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // prepare the plot data
        const maxHours = 100;
        const binnedHours = 2;
        const thresholds = d3.range(0, maxHours + 1, binnedHours);
        console.log({ thresholds });
        const totalHoursHistogram = d3.histogram()
                .domain([0, maxHours])
                .value(d => d.totalTime)
                .thresholds(thresholds);
        const totalHoursData = totalHoursHistogram(this.props.proposals);
        console.log(totalHoursData);
        const partnerHoursHistogram = d3.histogram()
                .domain([0, maxHours])
                .value(d => d.partnerTime)
                .thresholds(thresholds);
        const partnerHoursData = partnerHoursHistogram(this.props.proposals);

        // scales
        const xTicks = 6;
        const yTicks = 6;
        const maxCount = d3.max([...totalHoursData, ...partnerHoursData], d => d.length);
        const xScale = d3.scaleLinear()
                .domain([0, maxHours])
                .range([0, innerWidth])
                .nice(xTicks);
        const yScale = d3.scaleLinear()
                .domain([0, maxCount])
                .range([innerHeight, 0])
                .nice(yTicks);

        // axes
        const tickPadding = 10;
        const tickSizeInner = -5;
        const xAxisBottom = d3.axisBottom()
                .scale(xScale)
                .ticks(xTicks)
                .tickSizeInner(tickSizeInner)
                .tickSizeOuter(0)
                .tickPadding(tickPadding);
        const xAxisTop = d3.axisTop()
                .scale(xScale)
                .ticks(xTicks)
                .tickSizeInner(tickSizeInner)
                .tickSizeOuter(0)
                .tickPadding(tickPadding)
                .tickFormat('');
        const yAxisLeft = d3.axisLeft()
                .scale(yScale)
                .ticks(yTicks)
                .tickSizeInner(tickSizeInner)
                .tickSizeOuter(0)
                .tickPadding(tickPadding);
        const yAxisRight = d3.axisRight()
                .scale(yScale)
                .ticks(yTicks)
                .tickSizeInner(tickSizeInner)
                .tickSizeOuter(0)
                .tickPadding(tickPadding)
                .tickFormat('');

        // draw axes
        const xAxisBottomG = g.append('g')
                .attr('class', 'axis')
                .attr('transform', `translate(0, ${innerHeight})`);
        xAxisBottomG.call(xAxisBottom);
        const xAxisTopG = g.append('g')
                .attr('class', 'axis');
        xAxisTopG.call(xAxisTop);
        const yAxisLeftG = g.append('g')
                .attr('class', 'axis');
        yAxisLeftG.call(yAxisLeft);
        const yAxisRightG = g.append('g')
                .attr('class', 'axis')
                .attr('transform', `translate(${innerWidth}, 0)`);
        yAxisRightG.call(yAxisRight);

        // add axis labels
        xAxisBottomG.append('text')
                .attr('class', 'label')
                .attr('x', innerWidth / 2)
                .attr('y', 50)
                .text('Time (hrs)');
        yAxisLeftG.append('text')
                .attr('class', 'label')
                .attr('transform', 'rotate(-90)')
                .attr('x', -innerHeight / 2)
                .attr('y', -50)
                .attr('text-anchor', 'middle')
                .text('N');

        // plot total times
        const data = {
            total: totalHoursData,
            partner: partnerHoursData
        };
        ['total', 'partner'].forEach(key => {
            g.selectAll(`rect.${key}.time`)
                    .data(data[key])
                    .enter()
                    .append('rect')
                    .attr('class', `${key} time`)
                    .attr('x', d => xScale(d.x0))
                    .attr('y', d => yScale(d.length))
                    .attr('width', d => xScale(d.x1) - xScale(d.x0))
                    .attr('height', d => innerHeight - yScale(d.length));
        });
    };

    render() {
        const width = this.props.width || 700;
        const height = this.props.height || 700;
        return (
                <svg
                    width={width}
                    height={height}
                    ref={(svg) => this.target = svg}
                />
        );
    }
}

TotalTimeDistribution.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.object,
    proposals: PropTypes.array.isRequired
};

export default TotalTimeDistribution;
