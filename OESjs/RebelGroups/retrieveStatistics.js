/*******************************************************************************
 * Global variables
 ******************************************************************************/
let storageAdapter = {
  name: "IndexedDB",
  dbName: sim.model.name
};
let storeMan = new sTORAGEmANAGER( storageAdapter );
storeMan.createLog = true;

/*******************************************************************************
 * Generate the file from text
 *
 * @param {string} filename - Name of the file
 * @param {string} text - Content of the file
 ******************************************************************************/
let generateTextFile = function ( filename, text ) {
  let defData, defFile, defURL;

  defData = new Blob( [ text ], { type: "text/plain" } );

  defURL = window.URL.createObjectURL( defData );

  defFile = document.createElement( "a" );
  defFile.setAttribute( "style", "display: none" );
  defFile.setAttribute( "href", defURL );
  defFile.setAttribute( "download", filename );
  document.body.appendChild( defFile );
  defFile.click();
  window.URL.revokeObjectURL( defURL );
  defFile.remove();
};

/*******************************************************************************
 * Export data from experiments to text file
 *
 * @param {Array} expRuns - IDs of the experiment runs to export
 * @param {string} sep - Field separator character
 * @param {boolean} header - Enable/Disable header
 * @param {string} defFn - Experiment definitions filename
 * @param {string} sumFn - Summary output filename
 * @param {string} tsFn - Time series output filename
 ******************************************************************************/
let exportData = function ( expRuns, sep = ";", header = true,
  timeSeries = true, defFn = "definitions.csv", sumFn = "summary.csv",
  tsFn = "timeseries.csv" ) {

  storeMan.retrieveAll( oes.ExperimentScenarioRun ).then( function ( records ) {
    let param, output, expScenRun;
    let defHeader, defText, defLine;  // Definitions
    let sumHeader, sumText, sumLine;  // Summary
    let tsHeader, tsText, tsLine, ts; // Time Series

    defText = "";
    sumText = "";
    tsText = "";

    // Create output records
    for ( let i = 0; i < records.length; i += 1 ) {
      defLine = [];
      sumLine = [];
      expScenRun = new oes.ExperimentScenarioRun( records[ i ] );
      param = expScenRun.parameterValueCombination;
      output = expScenRun.outputStatistics;

      if ( expRuns.includes(
        expScenRun.getValueAsString( "experimentRun" ) ) ) {

        // Definition Header
        if ( typeof defHeader === "undefined" ) {
          defHeader = [];
          if ( header ) {
            for ( let j = 0; j < sim.experiment.parameterDefs.length; j += 1 ) {
              defHeader.push( sim.experiment.parameterDefs[ j ].name );
            }
            defText = [ "id", "experimentRun", "experimentScenarioNo" ].concat(
              defHeader ).join( sep ) + "\n";
          }
        }
        // Definition Line
        defLine.push( expScenRun[ "id" ] );
        defLine.push( expScenRun[ "experimentRun" ] );
        defLine.push( expScenRun[ "experimentScenarioNo" ] );
        param.forEach( function ( prop ) {
          defLine.push( prop );
        } );

        // Summary Header
        if ( typeof sumHeader === "undefined" ) {
          sumHeader = [];
          for ( let statVarName of Object.keys( output ) ) {
            if ( typeof output[ statVarName ] !== "object" ) {
              sumHeader.push( statVarName );
            }
          }
          if ( header ) {
            sumText = [ "id" ].concat( sumHeader ).join( sep ) + "\n";
          }
        }
        // Summary Line
        sumLine.push( expScenRun[ "id" ] );
        sumHeader.forEach( function ( prop ) {
          sumLine.push( output[ prop ] );
        } );

        // Time Series
        if ( timeSeries ) {
          // Time Series Header
          if ( typeof tsHeader === "undefined" ) {
            tsHeader = [];
            for ( let tsVarName of Object.keys( output.timeSeries ) ) {
              tsHeader.push( tsVarName );
            }
            if ( header ) {
              if ( typeof sim.model.timeIncrement !== "undefined" ) {
                tsText = [ "id", "time" ].concat( tsHeader ).join( sep ) + "\n";
              } else {
                tsText = [ "id", "time", "variable", "value" ].join( sep ) +
                  "\n";
              }
            }
          }

          // Time Series Line
          if ( tsHeader.length > 0 ) {

            ts = [];
            if ( typeof sim.model.timeIncrement !== "undefined" ) {
              for ( let v = 0; v < tsHeader.length; v += 1 ) {
                if ( output.timeSeries[ tsHeader[ v ] ] ) {
                  ts[ v ] = output.timeSeries[ tsHeader[ v ] ];
                }
              }

              for ( let r = 0, t = 0; r < ts[ 0 ].length; r += 1,
                t += sim.model.timeIncrement ) {
                tsLine = [];
                tsLine.push( expScenRun[ "id" ] );
                tsLine.push( t );
                for ( let v = 0; v < tsHeader.length; v += 1 ) {
                  tsLine.push( ts[ v ][ r ] );
                }

                tsText += tsLine.join( sep ) + "\n";
              }
            } else {
              for ( let v = 0; v < tsHeader.length; v += 1 ) {
                ts = output.timeSeries[ tsHeader[ v ] ];

                for ( let r = 0; r < ts[ 0 ].length; r += 1 ) {
                  tsLine = [];
                  tsLine.push( expScenRun[ "id" ] );
                  tsLine.push( ts[ 0 ][ r ] );
                  tsLine.push( tsHeader[ v ] );
                  tsLine.push( ts[ 1 ][ r ] );
                  tsText += tsLine.join( sep ) + "\n";
                }
              }
            }
          }
        }

        defText += defLine.join( sep ) + "\n";
        sumText += sumLine.join( sep ) + "\n";
      }
    }

    // Export data
    generateTextFile( defFn, defText );
    generateTextFile( sumFn, sumText );
    if ( timeSeries ) {
      generateTextFile( tsFn, tsText );
    }
  } ).catch( function ( err ) {
    console.log( err.name + ": " + err.message );
  } );
};

// Add Experiment Run in the Select
storeMan.retrieveAll( oes.ExperimentRun ).then( function ( records ) {
  let label, option;
  let selectOption = document.getElementById( "expRun" );

  for ( let i = 0; i < records.length; i += 1 ) {
    option = document.createElement( "input" );
    option.type = "checkbox";
    option.id = records[ i ].id;
    option.value = records[ i ].id;
    option.checked = "checked";
    selectOption.appendChild( option );

    label = document.createElement( "label" );
    label.appendChild( document.createTextNode( records[ i ].dateTime ) );
    selectOption.appendChild( label );

    selectOption.appendChild( document.createElement( "br" ) );
  }
} );

// Define the Export button action onClick
let button = document.getElementById( "export" );
button.addEventListener( "click", function () {
  let experiments = [], sep, header, timeSeries, defFn, sumFn, tsFn;
  let selectedOptions = document.querySelectorAll( "input[type=checkbox]" );

  let elements = [].filter.call( selectedOptions, function ( el ) {
    return el.checked;
  } );

  for ( let i = 0; i < elements.length; i += 1 ) {
    experiments.push( elements[ i ].id );
  }

  header = document.querySelector( "#header" ).checked;
  sep = document.querySelector( "#sep" ).value;
  timeSeries = document.querySelector( "#timeSeries" ).checked;

  defFn = document.querySelector( "#defFilename" ).value;
  sumFn = document.querySelector( "#sumFilename" ).value;
  tsFn = document.querySelector( "#tsFilename" ).value;

  exportData( experiments, sep, header, timeSeries, defFn, sumFn, tsFn );
} );