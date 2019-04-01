/*******************************************************************************
 * Demand event class
 *
 * @copyright Copyright 2018-2019 Brandenburg University of Technology, Germany
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
    "rebelGroup": { range: "RebelGroup", label: "Rebel group" }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var strengthRatio;

      if ( this.rebelGroup.nmrOfRebels > 0 ) {
        strengthRatio =
          sim.model.f.globalRelativeStrength( this.rebelGroup );
        this.rebelGroup.extortedEnterprises.forEach( ( enterprise ) => {
          /**
           * Decision to extort or loot
           *
           * Rebel Groups extort based on their strength with respect to
           * all other Rebel Groups, otherwise they loot
           */
          if ( rand.uniform() < strengthRatio ) {
            followupEvents.push( new Extort( {
              occTime: this.occTime + 1,
              rebelGroup: this.rebelGroup,
              enterprise: enterprise
            } ) );
          } else {
            followupEvents.push( new Loot( {
              occTime: this.occTime + 1,
              rebelGroup: this.rebelGroup,
              enterprise: enterprise
            } ) );
          }
        } );
      }
      return followupEvents;
    }
  }
} );
Demand.priority = 0;
Demand.recurrence = function ( e ) {
  return e.rebelGroup.freqDemand;
};
Demand.createNextEvent = function ( e ) {
  return new Demand( {
    occTime: e.occTime + Demand.recurrence( e ),
    rebelGroup: e.rebelGroup
  } );
};