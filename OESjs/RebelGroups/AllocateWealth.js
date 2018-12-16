/*******************************************************************************
 * AllocateWealth event class
 *
 * @copyright Copyright 2018-2019 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var AllocateWealth = new cLASS( {
  Name: "AllocateWealth",
  supertypeName: "eVENT",
  properties: {
    "rebelGroup": { range: "RebelGroup" }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var deltaRebels = 0, recruit = 0, expel = 0;
      var strengthRatio =
        sim.model.f.globalRelativeStrength( this.rebelGroup );
      var totalSalary = this.rebelGroup.nmrOfRebels * this.rebelGroup.rebelCost;

      if ( this.rebelGroup.wealth > totalSalary ) {
        this.rebelGroup.wealth -= totalSalary;
      } else {
        // Rebels not paid leave the Rebel Group
        expel = Math.ceil( ( totalSalary - this.rebelGroup.wealth ) /
          this.rebelGroup.rebelCost );
        this.rebelGroup.wealth = 0;
      }

      if ( ( this.rebelGroup.lastAmountExtorted > totalSalary ) &&
        ( strengthRatio < this.rebelGroup.recruitThreshold ) ) {
        // Recruit
        deltaRebels =
          Math.floor( ( this.rebelGroup.lastAmountExtorted - totalSalary ) /
            this.rebelGroup.rebelCost );

        recruit = Math.floor( Math.min( deltaRebels * ( 1 - strengthRatio ),
          ( this.rebelGroup.nmrOfRebels * this.rebelGroup.recruitRate ) ) );
      } else if ( totalSalary > this.rebelGroup.lastAmountExtorted ) {
        // Expel
        deltaRebels =
          Math.ceil( ( totalSalary - this.rebelGroup.lastAmountExtorted ) /
            this.rebelGroup.rebelCost );

        expel = Math.min( this.rebelGroup.nmrOfRebels,
          Math.max( expel, deltaRebels ) );
      }

      this.rebelGroup.nmrOfRebels = Math.max( 0,
        this.rebelGroup.nmrOfRebels + recruit - expel );

      // Release all Enterprises associated to a RebelGroup with nmrRebels = 0
      if ( this.rebelGroup.nmrOfRebels === 0 ) {
        this.rebelGroup.extortedEnterprises.forEach( function ( enterprise ) {
          enterprise.rebelGroup = null;
        } );
        this.rebelGroup.extortedEnterprises = [];
      }

      this.rebelGroup.lastAmountExtorted = 0;

      sim.stat.nmrOfRecruits += recruit;
      sim.stat.nmrOfExpels += expel;

      return followupEvents;
    }
  }
} );
AllocateWealth.recurrence = function ( e ) {
  return e.rebelGroup.freqAllocate;
};
AllocateWealth.createNextEvent = function ( e ) {
  var nextTime = e.occTime + AllocateWealth.recurrence( e );
  return new AllocateWealth( {
    occTime: nextTime,
    rebelGroup: e.rebelGroup
  } );
};