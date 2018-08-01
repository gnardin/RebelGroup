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
      var eKeys = Object.keys( enterprises );
      
      // Decide the Enterprise
      enterprise = enterprises[ eKeys[ 
        rand.uniformInt( 0, eKeys.length - 1) ] ];
      
      // Decide to extort or loot
      if ( rand.uniform() < 0.5 ) {
        
        // Decide the amount to extort
        extortion = rand.uniform();
        
        followupEvents.push( new Extort( {
          occTime: this.occTime + 1,
          rebelgroup: this.rebelgroup,
          enterprise: enterprise,
          extortion: extortion
        }));
        
      } else {
        
        followupEvents.push( new Loot( {
          occTime: this.occTime + 1,
          rebelgroup: this.rebelgroup,
          enterprise: enterprise
        }));
      }
      
      return followupEvents;
    }
  }
});

//ReminderPurchase.priority = 1;

ReminderDemand.recurrence = function () {
  return rand.uniformInt( 5, 10 );
};