/*******************************************************************************
 * Income event class
 *
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Income = new cLASS( {
  Name: "Income",
  supertypeName: "eVENT",
  properties: {
    "enterprise": {range: "Enterprise", label: "Enterprise"}
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];

      // Decide how much an Enterprise earn as Income
      var income = this.enterprise.income;

      this.enterprise.wealth += income;
      this.enterprise.accIncome += income;

      return followupEvents;
    }
  }
} );
Income.recurrence = function ( e ) {
  return e.enterprise.freqIncome;
};
Income.createNextEvent = function ( e ) {
  return new Income( {
    occTime: e.occTime + Income.recurrence( e ),
    enterprise: e.enterprise
  } );
};