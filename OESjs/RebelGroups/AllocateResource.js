/*******************************************************************************
 * AllocateResource event class
 *
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var AllocateResource = new cLASS( {
  Name: "AllocateResource",
  supertypeName: "eVENT",
  properties: {
    "rebelGroup": {
      range: "RebelGroup"
    }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var deltaRebels = 0, recruit = 0, expel = 0;
      var strengthRatio = sim.model.f.globalRelativeStrength( this.rebelGroup );

      var totalSalary = this.rebelGroup.nmrOfRebels *
        this.rebelGroup.rebelCost;

      /* CHECK Excessive recruitment */
      if ( this.rebelGroup.wealth > totalSalary ) {
        this.rebelGroup.wealth -= totalSalary;
      } else {
        // Rebels not paid leave the Rebel Group
        expel = Math.round( ( totalSalary - this.rebelGroup.wealth ) /
          this.rebelGroup.rebelCost );
        this.rebelGroup.wealth = 0;
      }

      if ( ( this.rebelGroup.wealth > this.rebelGroup.lastWealth ) &&
        ( strengthRatio < this.rebelGroup.freezeExpandThreshold ) ) {
        deltaRebels = ( ( this.rebelGroup.wealth -
          this.rebelGroup.lastWealth ) / this.rebelGroup.rebelCost );

        recruit = Math.min( deltaRebels,
          ( this.rebelGroup.nmrOfRebels * this.rebelGroup.expandRate ) );

      } else if ( this.rebelGroup.wealth < this.rebelGroup.lastWealth ) {
        deltaRebels += ( this.rebelGroup.lastWealth - this.rebelGroup.wealth ) /
          this.rebelGroup.rebelCost;

        expel += Math.min( this.rebelGroup.nmrOfRebels,
          deltaRebels );
      }

      this.rebelGroup.nmrOfRebels = Math.max( 1,
        this.rebelGroup.nmrOfRebels + recruit - expel );

      this.rebelGroup.lastWealth = this.rebelGroup.wealth;

      sim.stat.nmrOfRecruits += recruit;
      sim.stat.nmrOfExpels += expel;

      return followupEvents;
    }
  }
} );
AllocateResource.recurrence = function ( e ) {
  return e.rebelGroup.freqAllocate;
};
AllocateResource.createNextEvent = function ( e ) {
  return new AllocateResource( {
    occTime: e.occTime + AllocateResource.recurrence( e ),
    rebelGroup: e.rebelGroup
  } );
};