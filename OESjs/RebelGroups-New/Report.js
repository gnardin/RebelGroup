/*******************************************************************************
 * Report event class
 *
 * @copyright Copyright 2018-2019 Brandenburg University of Technology, Germany
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
    "rebelGroup": { range: "RebelGroup", label: "RebelGroup" },
    "enterprise": { range: "Enterprise", label: "Enterprise" },
    "extorter": { range: "RebelGroup", label: "Extorter" }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var strengthRatio, reports, fightProb;

      var extorterId = this.extorter.id;

      if ( !( extorterId in this.rebelGroup.reports ) ) {
        reports = 1;
      } else {
        reports = this.rebelGroup.reports[ extorterId ] + 1;
      }

      /* Fight Probability */
      strengthRatio =
        sim.model.f.relativeStrength( this.rebelGroup, this.extorter );

      fightProb = sim.model.f.sigmoid( 1, 1, 1,
        sim.model.f.normalizeValue( strengthRatio ), reports );

      // Decide to Fight
      if ( ( rand.uniform < fightProb ) &&
        ( this.rebelGroup.nmrOfRebels > 0 ) ) {
        followupEvents.push( new Fight( {
          attacker: this.rebelGroup,
          opponent: this.extorter
        } ) );
        this.rebelGroup.reports[ extorterId ] = 0;
      } else {
        this.rebelGroup.reports[ extorterId ] = reports;
      }

      sim.stat.nmrOfReports += 1;

      return followupEvents;
    }
  }
} );