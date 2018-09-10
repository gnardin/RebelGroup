/*******************************************************************************
 * Demand event class
 *
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Demand = new cLASS( {
  Name: "Demand",
  supertypeName: "eVENT",
  properties: {
    "rebelGroup": {
      range: "RebelGroup"
    }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var occTime = this.occTime;
      var rebelGroup = this.rebelGroup;
      var strengthRatio = sim.model.f.globalRelativeStrength( rebelGroup );

      rebelGroup.extortedEnterprises.forEach( ( enterprise ) => {
        /**
         * Decision to extort or loot
         *
         * Rebel Groups loot based on their strength with respect to the other
         * Rebel Groups, otherwise they extort
         *
         * TODO
         * Rebel Groups also loot if they receive external support that does
         * not require them to create a deeper connection with the community
         */
        if ( rand.uniform() < strengthRatio ) {
          followupEvents.push( new Loot( {
            occTime: occTime + 1,
            rebelGroup: rebelGroup,
            enterprise: enterprise
          } ) );
        } else {
          followupEvents.push( new Extort( {
            occTime: occTime + 1,
            rebelGroup: rebelGroup,
            enterprise: enterprise
          } ) );
        }
      } );
      return followupEvents;
    }
  }
} );
Demand.recurrence = function ( e ) {
  return e.rebelGroup.freqDemand;
};
Demand.createNextEvent = function ( e ) {
  return new Demand( {
    occTime: e.occTime + Demand.recurrence( e ),
    rebelGroup: e.rebelGroup
  } );
};