const sampleFile = "./static/data/samples.json"    // Path relative to `index.html`
const transparent = "rgba(0, 0, 0, 0)"

// Some statistics for later use.
// var minOTUID;       // (   2 at ID 966.)
// var maxOTUID;       // (3663 at ID 1489.)
var maxSampleValue; // (1305 at ID 1535.)
// var maxFreq;        // (   9 at ID 1279.)

function init() {
    // Grab a reference to the dropdown select element
    let selector = d3.select("#selDataset");    // The dropdown menu on the Web page
    
    // Use the list of sample names to populate the select options
    d3.json(sampleFile).then((data) => {
        // Get the minimum `otu_ids` value among all samples.
        // minOTUID = Math.min(...data.samples.map(samp => samp.otu_ids).flat());
        
        // Get the maximum `otu_ids` value among all samples.
        // maxOTUID = Math.max(...data.samples.map(samp => samp.otu_ids).flat());
        
        // Get the maximum `sample_values` value among all samples.
        maxSampleValue = Math.max(...data.samples.map(samp => samp.sample_values).flat());
        
        // Get the maximum `wfreq` value among all participants.
        // maxFreq = Math.max(...data.metadata.map(part => part.wfreq));
        
        let sampleNames = data.names;           // Array of ID numbers for all study participants
        
        sampleNames.forEach((sample) => {
            selector
                .append("option")               // Insert an `<option/>` element into the the `selector`'s `<select/>` element.
                .text(sample)                   // Put the sample's value (a participant's ID number) into the `<option/>` element as its text.
                .property("value", sample)      // Assign the sample's value to the `<option/>` element's `value` property.
                ;                               // [The previous two lines are reversible.]
        });
    
    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
}

// Demographics Panel
function buildMetadata(sample) {
    d3.json(sampleFile).then((data) => {
        
        let metadata = data.metadata;
        // Filter the data for the object with the desired sample number
        let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        let result = resultArray[0];
        // Use d3 to select the panel with id of `#sample-metadata`
        let PANEL = d3.select("#sample-metadata");
        
        // Use `.html("")` to clear any existing metadata
        PANEL.html("");
        
        // Use `Object.entries` to add each key and value pair to the panel
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, val]) => {
            
            key = key.toUpperCase();
            // Some of the gender values are lowercase; make them uppercase.
            if (key === 'GENDER') {
                val = val.toUpperCase();
            }
            
            PANEL
                .append("h6")
                .append("b")
                .text(`${key}: ${val}`)
                ;
        });
    });
}

// 1.1. Create the buildCharts function.
function buildCharts(sample) {                                                  // `sample` will be a participant's ID number
    // 1.2. Use d3.json to load and retrieve the samples.json file 
    d3.json(sampleFile).then((data) => {                                        // Extract the data from `sampleFile`. When finished, assign that data to `data`, and…
        // 1.3. Create a variable that holds the samples array.
        let samples = data.samples;                                             // get `data`'s `samples` value (an array of JSON objects);
        
        // 1.4. Create a variable that filters the samples
        // for the object with the desired sample number.
        let resultArray = samples.filter(sampleObj => sampleObj.id == sample);  // filter the array to include only elements whose `id` values match `sample`'s value;
        
        // 3.1. Create a variable that filters the metadata array for the object with the desired sample number.
        let metaArray = data.metadata.filter(part => part.id == sample);
        
        // 1.5. Create a variable that holds the first sample in the array.
        let result = resultArray[0];                                            // assign the array element at index 0 (it should be the only one) to `result`.
        
        // 3.2. Create a variable that holds the first sample in the metadata array.
        let meta = metaArray[0];
        
        const topN = 10;
        
        // 1.6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        let otuIDs = result.otu_ids;                                            // An array of integers, but what do they mean?
        let otuLabels = result.otu_labels;                                      // An array of strings (Ex: ['Bacteria;Bacteroidetes;…', '…']), but what do they mean?
        let sampleValues = result.sample_values;                                // An array of integers, but what do they mean?
        
        // 3.3. Create a variable that holds the washing frequency.
        let freq = meta.wfreq;
        
        // 1.7. Create the yticks for the bar chart.
        // Hint: Get the the top 10 otu_ids and map them in descending order
        // so the otu_ids with the most bacteria are last.
        
        // let yticks = otuIDs.slice(0, topN).map( elem => `OTU ${elem.toString()}` )
        
        // 1.8. Create the trace for the bar chart.
        let barData = {
            type: "bar",
            orientation: "h",
            y: otuIDs.slice(0,topN).reverse().map( elem => `OTU ${elem.toString()}` ),
            x: sampleValues.slice(0,topN).reverse()
        };
        
        // 1.9. Create the layout for the bar chart.
        let barLayout = {
            title: `<b>Top ${topN} Bacterial Cultures Found</b>`,
            yaxis: {title: "Bacterium ID"},
            xaxis: {title: "Bacterial Count"},
            plot_bgcolor: transparent,
            paper_bgcolor: transparent
        };
        
        // 1.10. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bar", [barData], barLayout)

        // 2.1. Create the trace for the bubble chart.
        var bubbleData = {
            mode: "markers",
            x: otuIDs,
            y: sampleValues,
            text: otuLabels,
            marker: {
                sizemode: "area",
                size: sampleValues,
                sizeref: maxSampleValue / 50000,                        // See https://plotly.com/javascript/bubble-charts/
                // Set the color to scale proportionally with ID number
                // color: otuIDs.map( id => `hsl(${360 - Math.floor(300 * id / maxOTUID)}, 100%, 50%)` )
                color: otuIDs,
                colorscale:
                    // "Blackbody"
                    // "Bluered"
                    // "Blues"
                    // "Cividis"
                    "Earth"
                    // "Electric"
                    // "Greens"
                    // "Greys"
                    // "Hot"
                    // "Jet"
                    // "Picnic"
                    // "Portland"
                    // "Rainbow"
                    // "RdBu"
                    // "Reds"
                    // "Viridis"
                    // "YlGnBu"
                    // "YlOrRd"
            }
        };
        
        // 2.2. Create the layout for the bubble chart.
        var bubbleLayout = {
            title: "<b>Bacterial Cultures per Sample</b>",
            yaxis: {title: "Bacterial Count"},
            xaxis: {title: "Bacterium OTU ID"},
            plot_bgcolor: transparent,
            paper_bgcolor: transparent,
            hovermode: "closest"
        };
        
        // 2.3. Use Plotly to plot the data with the layout.
        Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
        
        // 3.4. Create the trace for the gauge chart.
        var gaugeData = {
            // domain: { x: [0, 1], y: [0, 1] },
            title: {text: "Scrubs per Week"},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: {
                    range: [0, 10],
                    dtick: 2,
                    ticksuffix: " scrubs",
                    showticksuffix: "last"
                },
                bar: {color: "black",},
                steps: [
                    {range: [0,2], color: "red"},
                    {range: [2,4], color: "orange"},
                    {range: [4,6], color: "yellow"},
                    {range: [6,8], color: "yellowgreen"},
                    {range: [8,10], color: "green"}
                ]
            },
            value: freq
        };
        
        // 3.5. Create the layout for the gauge chart.
        var gaugeLayout = { 
            title: "<b>Belly Button Washing Frequency</b>",
            height: 350,
            plot_bgcolor: transparent,
            paper_bgcolor: transparent
        };
        
        // 3.6. Use Plotly to plot the gauge data and layout.
        Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
    });
}
