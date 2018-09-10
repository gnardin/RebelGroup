/*******************************************************************************
 * Report event class
 *
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Report = new cLASS( {
  Name: "Report",
  supertypeName: "eVENT",
  properties: {
    "rebelGroup": {
      range: "RebelGroup"
    },
    "enterprise": {
      range: "Enterprise"
    },
    "extorter": {
      range: "RebelGroup"
    }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var nmrOfReports, fightProb;
      var extorterId = this.extorter.id;

      if ( !( extorterId in this.rebelGroup.reports ) ) {
        nmrOfReports = 1;
      } else {
        nmrOfReports = this.rebelGroup.reports[ extorterId ];
      }

      /* CHECK How to calculate the probability to fight? */
      fightProb = 1 / ( 1 + Math.pow( Math.E, -3 *
        ( ( nmrOfReports * 10 ) - 5 ) ) );

      if ( rand.uniform < fightProb ) {
        followupEvents.push( new Fight( {
          defiant: this.rebelGroup,
          opponent: this.extorter
        } ) );
        this.rebelGroup.reports[ extorterId ] = 0;
      } else {
        this.rebelGroup.reports[ extorterId ] = nmrOfReports + 1;
      }

      sim.stat.nmrOfReports += 1;

      return followupEvents;
    }
  }
} );