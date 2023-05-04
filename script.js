let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

let countyData
let educationData

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () => {

    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')

            .attr('fill', (item) => {
                let fips = item['id']
                let county = educationData.find((county) => {
                    return county['fips'] === fips
                })
                let percentage = county['bachelorsOrHigher']
                if (percentage <= 15){
                    return 'tomato'
                }else if (percentage <= 30){
                    return 'orange'
                } else if (percentage <= 45){
                    return 'lightgreen'
                } else {
                    return 'limegreen'
                }
              })

            .attr('data-fips', (countyDataItem) => {
                return countyDataItem['id']
            })
            .attr('data-education', (item) => {
                let fips = item['id']
                let county = educationData.find((county) => {
                    return county['fips'] === fips
                })
                let percentage = county['bachelorsOrHigher']
                return percentage
            })

            .on('mouseover', (item) => {
            tooltip.transition()
                    .style('visibility', 'visible')
            
            let fips = item['id']
            let county = educationData.find((county) => {
                return county['fips'] === fips
            })        

            tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')

            tooltip.attr('data-education', county['bachelorsOrHigher'])

            })


            .on('mouseout', (item) => {
            tooltip.transition()
                    .style('visibility', 'hidden')
            })

            
}

// import the county data
d3.json(countyURL).then(
    (data, error) => {
        if(error) {
            console.log(error)
        } else {
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            // import the education data 
            d3.json(educationURL).then(
                (data, error) => {
                    if(error) {
                        console.log(error)
                    } else {
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)