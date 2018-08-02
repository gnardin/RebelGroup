/*******************************************************************************
 * ReminderDemand event class
 * 
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var ReminderDemand = new cLASS({
  Name: "ReminderDemand",
  supertypeName: "eVENT",
  properties: {
    "rebelgroup": {
      range: "RebelGroup"
    }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var enterprise, extortion;
      var enterprises = this.rebelgroup.enterprises;
      
      var powerRatio = sim.model.f.powerRatio( this.rebelgroup );
      
      console.log( powerRatio );
      
      Object.keys( enterprises ).forEach( function ( objId ) {
        enterprise = enterprises[objId];
        
        /**
         * Decision to extort or loot
         * 
         * Rebel Groups loot proportional to their weakness with respect to
         * the strongest Rebel Group, otherwise they extort
         * 
         * TODO
         * Rebel Groups also loot if they receive external support that does
         * not require them to create a deeper connection with the community
         */
        if ( rand.uniform() < powerRatio ) {
          
          console.log( this.occTime + " LOOT" );
          
          followupEvents.push( new Loot( {
            occTime: this.occTime + 1,
            rebelgroup: this.rebelgroup,
            enterprise: enterprise
          }));
        } else {
          
          console.log( this.occTime + " EXTORT" );
          followupEvents.push( new Extort( {
            occTime: this.occTime + 1,
            rebelgroup: this.rebelgroup,
            enterprise: enterprise
          }));
        }
      });
      
      return followupEvents;
    }
  }
});

ReminderDemand.recurrence = function () {
  console.log( "HERE" );
  return parseInt( rand.normal( 30, 5 ) );
};