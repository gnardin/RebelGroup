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
      var enterprises = cLASS["Enterprise"].instances;
      
      Object.keys( enterprises ).forEach( function ( a ) {
        enterprise = enterprises[a];
        
        // Decide to extort or loot
        // Looting:
        // Ratio of power (weak)
        // Enterprise is controlled by another group
        // If they receive external money
        if ( rand.uniform() < 0.5 ) {
          
          followupEvents.push( new Extort( {
            occTime: this.occTime + 1,
            rebelgroup: this.rebelgroup,
            enterprise: enterprise
          }));
          
        } else {
          
          followupEvents.push( new Loot( {
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

//ReminderPurchase.priority = 1;

ReminderDemand.recurrence = function () {
  return rand.normal( 30, 5 );
};