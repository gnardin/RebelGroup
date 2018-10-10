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
 * Export data from experiments to text file
 *
 * @param {Array} expRuns - IDs of the experiment runs to export
 * @param {string} filename - Export filename
 * @param {string} sep - Field separator character
 * @param {boolean} header - Enable/Disable header
 ******************************************************************************/
let exportData = function ( expRuns, filename = "output.txt", sep = ";",
  header = true ) {

  storeMan.retrieveAll( oes.ExperimentScenarioRun ).then( function ( records ) {
    let hline, line, text, param, output, expScenRun, data, url, file;

    // Create Header
    hline = [];
    hline.push( "id" );
    hline.push( "experimentRun" );
    hline.push( "experimentScenarioNo" );

    for ( let i = 0; i < sim.experiment.parameterDefs.length; i += 1 ) {
      hline.push( sim.experiment.parameterDefs[ i ].name );
    }

    for ( let statVarName of Object.keys( sim.model.statistics ) ) {
      hline.push( statVarName );
    }

    if ( header ) {
      text = hline.join( sep ) + "\n";
    } else {
      text = "";
    }

    // Create output records
    for ( let i = 0; i < records.length; i += 1 ) {
      line = [];
      expScenRun = new oes.ExperimentScenarioRun( records[ i ] );
      param = expScenRun.parameterValueCombination;
      output = expScenRun.outputStatistics;

      if ( expRuns.includes(
        expScenRun.getValueAsString( "experimentRun" ) ) ) {

        line.push( expScenRun[ hline[ 0 ] ] );
        line.push( expScenRun[ hline[ 1 ] ] );
        line.push( expScenRun[ hline[ 2 ] ] );

        // Input parameter values
        param.forEach( function ( prop ) {
          line.push( prop );
        } );

        // Output statistics value
        Object.keys( output ).forEach( function ( prop ) {
          if ( ( typeof output[ prop ] ) !== "object" ) {
            line.push( output[ prop ] );
          }
        } );

        text += line.join( sep ) + "\n";
      }
    }

    // Generate and export the file
    data = new Blob( [ text ], { type: "text/plain" } );

    url = window.URL.createObjectURL( data );

    file = document.createElement( "a" );
    file.setAttribute( "style", "display: none" );
    file.setAttribute( "href", url );
    file.setAttribute( "download", filename );
    document.body.appendChild( file );
    file.click();
    window.URL.revokeObjectURL( url );
    file.remove();
  } ).catch( function ( err ) {
    console.log( err.name + ": " + err.message );
  } );
};

let retrieveStatistics = function () {
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
    let experiments = [], filename, sep, header;
    let selectedOptions = document.querySelectorAll( "input[type=checkbox]" );

    let elements = [].filter.call( selectedOptions, function ( el ) {
      return el.checked;
    } );

    for ( let i = 0; i < elements.length; i += 1 ) {
      experiments.push( elements[ i ].id );
    }

    header = document.querySelector( "#header" ).checked;
    sep = document.querySelector( "#sep" ).value;
    filename = document.querySelector( "#fname" ).value;

    exportData( experiments, filename, sep, header );
  } );
};