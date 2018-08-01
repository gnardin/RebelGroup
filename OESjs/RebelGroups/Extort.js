/*******************************************************************************
 * Extort event class
 * 
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Extort = new cLASS({
  Name: "Extort",
  supertypeName: "eVENT",
  properties: {
    "rebelgroup": {
      range: "RebelGroup"
    },
    "enterprise": {
      range: "Enterprise"
    },
    "extortion": {
      range: "Decimal"
    }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var amount = this.enterprise.wealth * this.extortion;
      
      this.rebelgroup.wealth += amount;
      this.enterprise.wealth -= amount;
      
      sim.stat.extortions += 1;
      sim.stat.amountExtLoot = amount;
      
      return followupEvents;
    }
  }
});