/*******************************************************************************
 * The Rebel Group object class
 * 
 * @copyright Copyright 2017-2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 * @author Jakub Lelo
 ******************************************************************************/
var RebelGroup = new cLASS( {
  Name: "RebelGroup",
  supertypeName: "oBJECT",
  properties: {
    "numRebels": {
      range: "NonNegativeInteger",
      label: "Number Rebels"
    },
    "toDemandEnt": {
      range: "NonNegativeInteger",
      minCard: 0,
      maxCard: Infinity
    }
  },
  
  methods: {
    // Define the Enterprise to demand extortion money
    "demandExtortionFrom": function () {
      var enterprise;
      
      if ( this.toDemandEnt.length === 0 ) {
        this.toDemandEnt = Object.keys( cLASS["Enterprise"].instances );
        rand.shuffleArray( this.toDemandEnt );
      }
      
      enterprise = enterprises[this.toDemandEnt.splice( 0, 1 )];
      
      return enterprise;
    }
  }
} );
