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
    "rebelGroup": { range: "RebelGroup", label: "Rebel group" },
    "enterprise": { range: "Enterprise", label: "Enterprise" }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var amount = this.enterprise.wealth;

      /* CHECK Flee Probability */
      /* TODO Replace it by a function */
      var fleeProb = this.enterprise.fleeProb;

      // Update Rebel Group
      this.rebelGroup.wealth += amount;
      this.rebelGroup.lastAmountExtorted += amount;

      // Update Enterprise
      this.enterprise.wealth = 0;
      this.enterprise.accIncome = 0;
      this.enterprise.nmrOfLootings += 1;

      if ( this.enterprise.rebelGroup.id === this.rebelGroup.id ) {
        if ( ( rand.uniform() < fleeProb ) ||
          ( this.enterprise.nmrOfLootings > this.enterprise.fleeThreshold ) ) {
          followupEvents.push( new Flee( {
            occTime: this.occTime + 1,
            enterprise: this.enterprise
          } ) );
        }
      } else {
        // Flee or Report if looted by a different Rebel Group
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

      sim.stat.nmrOfLoots += 1;
      // sim.stat.amountLooted += amount;

      return followupEvents;
    }
  }
} );