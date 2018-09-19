/*******************************************************************************
 * Fight event class
 *
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Fight = new cLASS( {
  Name: "Fight",
  supertypeName: "eVENT",
  properties: {
    "defiant": {range: "RebelGroup", label: "Attacker"},
    "opponent": {range: "RebelGroup", label: "Opponent"}
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var strongRG, weakRG, strongRGProb, weakRGProb, enterprise, index, len, i;

      // Define the strong and weak Rebel Groups
      if ( this.defiant.nmrOfRebels > this.opponent.nmrOfRebels ) {
        strongRG = this.defiant;
        weakRG = this.opponent;
      } else {
        strongRG = this.opponent;
        weakRG = this.defiant;
      }

      /* Rebel Groups fight only if they have rebels */
      if ( ( strongRG.nmrOfRebels > 0 ) || ( weakRG.nmrOfRebels > 0 ) ) {
        strongRGProb = sim.model.f.relativeStrength( strongRG, weakRG );
        weakRGProb = sim.model.f.relativeStrength( weakRG, strongRG );

        /* Probability the strong Rebel Group wins the fight */
        if ( rand.uniform() < strongRGProb ) {
          // Define number of Enterprises to transfer
          len = weakRG.extortedEnterprises.length;
          if ( len >= sim.v.basket ) {
            len = sim.v.basket;
          }
          // Transfer random Enterprise from weak to strong Rebel Group
          for ( i = 0; i < len; i += 1 ) {
            index = rand.uniformInt( 0, weakRG.extortedEnterprises.length - 1 );
            enterprise = weakRG.extortedEnterprises[ index ];
            weakRG.extortedEnterprises.splice( index, 1 );
            enterprise.rebelGroup = strongRG;
            strongRG.extortedEnterprises =
              strongRG.extortedEnterprises.concat( enterprise );
            enterprise.nmrOfLoot = 0;
          }
        } else {
          /* Probability the weak Rebel Group wins the fight */
          if ( rand.uniform() < weakRGProb ) {
            // Define number of Enterprises to transfer
            len = strongRG.extortedEnterprises.length;
            if ( len >= sim.v.basket ) {
              len = sim.v.basket;
            }
            // Transfer random Enterprise from strong to weak Rebel Group
            for ( i = 0; i < len; i += 1 ) {
              index = rand.uniformInt( 0,
                strongRG.extortedEnterprises.length - 1 );
              enterprise = strongRG.extortedEnterprises[ index ];
              strongRG.extortedEnterprises.splice( index, 1 );
              enterprise.rebelGroup = weakRG;
              weakRG.extortedEnterprises =
                weakRG.extortedEnterprises.concat( enterprise );
              enterprise.nmrOfLoot = 0;
            }
          }
        }

        /*
         * Fight causes the decrease of Rebel Group members proportional to the
         * opposite Rebel Group's strength
        */
        strongRG.nmrOfRebels -= Math.round( strongRG.nmrOfRebels * weakRGProb );
        weakRG.nmrOfRebels -= Math.round( weakRG.nmrOfRebels * strongRGProb );

        sim.stat.nmrOfFights += 1;
      }

      return followupEvents;
    }
  }
} );