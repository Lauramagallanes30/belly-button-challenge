// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const Metadata = metadata.find(item => item.id === Number(sample));

    // Use d3 to select the panel with id of `#sample-metadata`
    const PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    // Maybe Edit 
    Object.entries(Metadata).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let filteredsamples = samples.find(item => item.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    const otuIDT = filteredsamples.otu_ids;
    const sampleValues = filteredsamples.sample_values;
    const otuLabels = filteredsamples.otu_labels;

    // Build a Bubble Chart
    var trace1 = {
      x: otuIDT,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues.map(value => value * 0.75),
        color: otuIDT,
        colorscale: 'Viridis'
      }
    };

    var data_bubble = [trace1];
    
    var layout_bubble = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID'},
      yaxis: { title: 'Number of Bacteria'},
      showlegend: false,
      width: 1200
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", data_bubble, layout_bubble);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otuIDT.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // Top 10 
    const top10Values = sampleValues.slice(0, 10).reverse();  
    const top10OotuIds = otuIDT.slice(0, 10).reverse();       
    const top10OtuLabels = otuLabels.slice(0, 10).reverse(); 

    // Build a Bar Chart
    var trace2 = {
      type: 'bar',
      x: top10Values,      
      y: yticks,           
      text: top10OtuLabels, 
      orientation: 'h'     
    };
    
    var data_bar = [trace2];
    
    var layout_bar = {
      title: 'Top 10 Bacteria Cultures Discovered', 
      xaxis: { title: 'Number of Bacteria' }   
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", data_bar, layout_bar);
  });
} 

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown_menu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      dropdown_menu.append("option").text(sample).attr("value", sample);
    });
    // Get the first sample from the list
    const first_listsample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(first_listsample);
    buildMetadata(first_listsample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
