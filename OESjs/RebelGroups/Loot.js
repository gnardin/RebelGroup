/*******************************************************************************
 * Loot event class
 * 
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Loot = new cLASS({
  Name: "Loot",
  supertypeName: "eVENT",
  properties: {
    "rebelgroup": {
      range: "RebelGroup"
    },
    "enterprise": {
      range: "Enterprise"
    }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var amount = this.enterprise.wealth;
      
      this.rebelgroup.wealth += amount;
      this.enterprise.wealth = 0;
      
      // Entrepreneur decides to flee
      if ( rand.uniform() < 0.5 ) {
        followupEvents.push( new Flee( {
          occTime: this.occTime + 1,
          enterprise: this.enterprise
        }));
      }
      
      sim.stat.lootings += 1;
      sim.stat.amountExtLoot = amount;
      
      return followupEvents;
    }
  }
});