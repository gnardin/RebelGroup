/*******************************************************************************
 * Flee event class
 * 
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Flee = new cLASS({
  Name: "Flee",
  supertypeName: "eVENT",
  properties: {
    "enterprise": {
      range: "Enterprise"
    }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      
      sim.stat.flees += 1;
      
      return followupEvents;
    }
  }
});