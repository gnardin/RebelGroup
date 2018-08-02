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
    }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      
      // Decide the amount to extort
      var extortion = this.enterprise.accIncome *
        this.rebelgroup.extortionRate;
      
      this.rebelgroup.wealth += extortion;
      this.enterprise.wealth -= extortion;
      this.enterprise.accIncome = 0;
      
      sim.stat.extortions += 1;
      sim.stat.amountExtLoot = extortion;
      
      return followupEvents;
    }
  }
});