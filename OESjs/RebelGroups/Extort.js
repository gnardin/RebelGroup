/*******************************************************************************
 * Extort event class
 *
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Extort = new cLASS( {
  Name: "Extort",
  supertypeName: "eVENT",
  properties: {
    "rebelGroup": { range: "RebelGroup", label: "Rebel group" },
    "enterprise": { range: "Enterprise", label: "Enterprise" }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];

      /**
       * Decide the amount to extort
       *
       * The amount is calculated based on the amount of income the enterprise
       * accumulated since the last extortion
       */
      var extortion = this.enterprise.accIncome *
        this.rebelGroup.extortionRate;

      if ( this.enterprise.wealth < extortion ) {
        extortion = this.enterprise.wealth;
      }

      // Update Rebel Group
      this.rebelGroup.wealth += extortion;
      this.rebelGroup.lastAmountExtorted += extortion;

      // Update Enterprise
      this.enterprise.wealth -= extortion;
      this.enterprise.accIncome = 0;
      this.enterprise.nmrOfExtortions += 1;

      // Enterprise reports if extorted by a different Rebel Group
      if ( this.enterprise.rebelGroup.id !== this.rebelGroup.id ) {
        followupEvents.push( new Report( {
          occTime: this.occTime + 1,
          rebelGroup: this.enterprise.rebelGroup,
          enterprise: this.enterprise,
          extorter: this.rebelGroup
        } ) );
      }

      sim.stat.nmrOfExtortions += 1;
      sim.stat.amountExtorted += extortion;

      return followupEvents;
    }
  }
} );