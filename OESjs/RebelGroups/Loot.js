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
var Loot = new cLASS( {
  Name: "Loot",
  supertypeName: "eVENT",
  properties: {
    "rebelGroup": {
      range: "RebelGroup"
    },
    "enterprise": {
      range: "Enterprise"
    }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var fleeProb;
      var amount = this.enterprise.wealth;

      /* CHECK How to calculate the probability to flee? */
      fleeProb = 1 / ( 1 + Math.pow( Math.E, -1 * this.enterprise.wealth ) );

      this.rebelGroup.wealth += amount;
      this.enterprise.wealth = 0;
      this.enterprise.accIncome = 0;
      this.enterprise.nmrOfLoot += 1;

      if ( this.enterprise.rebelGroup.id === this.rebelGroup.id ) {
        if ( ( rand.uniform() < fleeProb ) ||
          ( this.enterprise.nmrOfLoot > this.enterprise.fleeThreshold ) ) {
          followupEvents.push( new Flee( {
            occTime: this.occTime + 1,
            enterprise: this.enterprise
          } ) );
        }
      } else {
        if ( rand.uniform() < fleeProb ) {
          followupEvents.push( new Flee( {
            occTime: this.occTime + 1,
            enterprise: this.enterprise
          } ) );
        } else {
          followupEvents.push( new Report( {
            occTime: this.occTime + 1,
            rebelGroup: this.enterprise.rebelGroup,
            enterprise: this.enterprise,
            extorter: this.rebelGroup
          } ) );
        }
      }

      sim.stat.nmrOfLoot += 1;
      sim.stat.amountLoot += amount;

      return followupEvents;
    }
  }
} );