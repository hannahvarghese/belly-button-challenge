// read samples.json
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

let data = null;

// fetch JSON and console log it
d3.json(url).then(function(json) {
    data = json;
    console.log(data);
    populateDropdown(json.metadata);
    optionChanged(data.samples[0].id);
});
  
const populateDropdown = (metadata) => {
    let ids = metadata.map(person => person.id);
    let dropdown = document.getElementById("selDataset"); 

    // clear existing options CGT
    dropdown.innerHTML = "";

    // creating a task for each array
    ids.forEach((id) => {
        let el = document.createElement("option");
        el.textContent = id;
        el.value = id;
        dropdown.appendChild(el)
    });
};

const optionChanged = (subjectID) => {
    if (data !== null) {
        let sample = getSample(subjectID, data.samples);
        barChart(sample);
        bubbleChart(sample);
        displayMetadata(subjectID);
    }
};

const getSample = (subjectID, samples) => {
    return samples.find((sample) => {
        return sample.id === subjectID;
    });
};

const getValueofDropdown = () => {
    return document.getElementById("selDataset").value;
};

// bar chart
const barChart = (sample) => {

    // variables
    let sample_values = sample.sample_values.slice(0,10).reverse();
    let otu_labels = sample.otu_labels;
    let otu_ids = sample.otu_ids.slice(0,10);
    let y_ticks = otu_ids.map(id => `OTU ${id}`).reverse();

    // horizontal bar chart 
    let trace = {
        x: sample_values,
        y: y_ticks,
        type: "bar",
        orientation: "h"
    }; 

        let layout = {
            title: "Top 10 OTU IDs Bar Graph",
            x_axis: {
                title: "OTU Sample Value",
                title_font: {
                    size: 16
                },
                tick_font: {
                    size: 14
                }
            },
            y_axis: {
                tick_font: {
                    size: 14
                }
            }
    };
    
    Plotly.newPlot("bar", [trace], layout);
};
   
// bubble chart
const bubbleChart = (sample) => {

    // variables
    let sample_values =sample.sample_values;
    let otu_labels = sample.otu_labels;
    let otu_ids = sample.otu_ids;

    let trace_two = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            size: sample_values,
            color:otu_ids,
            colorscale: 'Earth'
        }
    }

        let layout = {
            title: "Top 10 OTU IDs Bubble Chart",
            x_axis: {
                title: "OTU ID"
            },
            y_axis: {
                title: "Sample Value"
            }
    };

    Plotly.newPlot("bubble", [trace_two], layout);
};

// function to display metadata
const displayMetadata = (subjectID) => {
    const metadataDiv = document.getElementById("sample-metadata");
    if (data !== null) {
        const metadata = getMetadata(subjectID, data.metadata);
        // clear existing metadata
        metadataDiv.innerHTML = "";

        // loop through the metadata and append it to the div
        for (const [key, value] of Object.entries(metadata)) {
            const metadataItem = document.createElement("p");
            metadataItem.textContent = `${key}: ${value}`;
            metadataDiv.appendChild(metadataItem);
        }
    }
};

// function to get metadata for a subject
const getMetadata = (subjectID, metadata) => {
    return metadata.find((entry) => {
        return entry.id === parseInt(subjectID);
    });
};