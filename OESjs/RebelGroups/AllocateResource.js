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
      var deltaRebels;
      var totalSalary = this.rebelGroup.nmrOfRebels *
        this.rebelGroup.rebelCost;

      /* CHECK Excessive recruitment */
      if ( this.rebelGroup.wealth > totalSalary ) {
        this.rebelGroup.wealth -= totalSalary;
      } else {
        deltaRebels = this.rebelGroup.nmrOfRebels -
          Math.round( this.rebelGroup.wealth / totalSalary );
        this.rebelGroup.wealth = 0;
      }

      if ( this.rebelGroup.wealth > this.rebelGroup.lastWealth ) {
        deltaRebels = ( this.rebelGroup.wealth - this.rebelGroup.lastWealth ) /
          this.rebelGroup.rebelCost;
        this.rebelGroup.nmrOfRebels += deltaRebels;
      } else if ( this.rebelGroup.wealth < this.rebelGroup.lastWealth ) {
        deltaRebels = ( this.rebelGroup.lastWealth - this.rebelGroup.wealth ) /
          this.rebelGroup.rebelCost;
        this.rebelGroup.nmrOfRebels -= deltaRebels;
      }

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