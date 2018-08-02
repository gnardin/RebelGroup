/*******************************************************************************
 * ReminderIncome event class
 * 
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var ReminderIncome = new cLASS({
  Name: "ReminderIncome",
  supertypeName: "eVENT",
  properties: {
    "enterprise": {
      range: "Enterprise"
    }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      
      console.log( "Income " + this.occTime );
      
      // Decide how much an Enterprise receives as Income
      var revenue = rand.normal( this.enterprise.meanIncome,
          this.enterprise.stdDevIncome );
      
      this.enterprise.wealth += revenue;
      this.enterprise.accIncome += revenue;
      
      return followupEvents;
    }
  }
});

ReminderIncome.recurrence = function () {
  return 1;
};

ReminderIncome.createNextEvent = function ( e ) {
  var nextTime = e.occTime + ReminderIncome.recurrence();
  console.log( "CURRENT " + e.occTime + " NEXT " + nextTime );
  console.log( typeof( e.occTime ));
  console.log( typeof( ReminderIncome.recurrence() ));
  return new ReminderIncome( {
    occTime: e.occTime + ReminderIncome.recurrence(),
    enterprise: e.enterprise
  } );
};
