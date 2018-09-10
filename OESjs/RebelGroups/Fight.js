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
    "defiant": {
      range: "RebelGroup"
    },
    "opponent": {
      range: "RebelGroup"
    }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var strongRG, weakRG, strongRGProb, weakRGProb, enterprise, index, len, i;

      if ( this.defiant.nmrOfRebels > this.opponent.nmrOfRebels ) {
        strongRG = this.defiant;
        weakRG = this.opponent;
      } else {
        strongRG = this.opponent;
        weakRG = this.defiant;
      }

      strongRGProb = strongRG.nmrOfRebels /
        ( strongRG.nmrOfRebels + weakRG.nmrOfRebels );

      weakRGProb = weakRG.nmrOfRebels /
        ( strongRG.nmrOfRebels + weakRG.nmrOfRebels );

      if ( rand.uniform() < strongRGProb ) {
        len = weakRG.extortedEnterprises.length;
        if ( len >= sim.v.basket ) {
          len = sim.v.basket;
        }
        for ( i = 0; i < len; i += 1 ) {
          index = rand.uniformInt( 0, weakRG.extortedEnterprises.length - 1 );
          enterprise = weakRG.extortedEnterprises[ index ];
          weakRG.extortedEnterprises.splice( index, 1 );
          enterprise.rebelGroup = strongRG;
          enterprise.nmrOfLoot = 0;
          strongRG.extortedEnterprises =
            strongRG.extortedEnterprises.concat( enterprise );
        }
      } else {
        if ( rand.uniform() < weakRGProb ) {
          len = strongRG.extortedEnterprises.length;
          if ( len >= sim.v.basket ) {
            for ( i = 0; i < len; i += 1 ) {
              index = rand.uniformInt( 0,
                strongRG.extortedEnterprises.length - 1 );
              enterprise = strongRG.extortedEnterprises[ index ];
              strongRG.extortedEnterprises.splice( index, 1 );
              enterprise.rebelGroup = weakRG;
              enterprise.nmrOfLoot = 0;
              weakRG.extortedEnterprises =
                weakRG.extortedEnterprises.concat( enterprise );
            }
          }
        }
      }

      /* CHECK Fight is causing too many deaths */
      strongRG.nmrOfRebels -= Math.round( strongRG.nmrOfRebels * weakRGProb );
      weakRG.nmrOfRebels -= Math.round( weakRG.nmrOfRebels * strongRGProb );

      sim.stat.nmrOfFights += 1;

      return followupEvents;
    }
  }
} );