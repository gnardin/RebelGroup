/*******************************************************************************
 * Rebel Groups simulation model
 *
 * @copyright Copyright 2018 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
/******************************************************************************
 * Simulation Parameters
 ******************************************************************************/
sim.scenario.simulationEndTime = 365;
sim.scenario.idCounter = 1; // optional
//sim.scenario.randomSeed = 1234; // optional
/*******************************************************************************
 * Simulation Config
 ******************************************************************************/
// sim.config.stepDuration = 0; // optional
// sim.config.createLog = false; // optional
// sim.config.userInteractive = false; // optional
// sim.config.visualize = false; // optional
/*******************************************************************************
 * Simulation Model
 ******************************************************************************/
sim.model.time = "discrete";
sim.model.timeUnit = "D"; // D = days
sim.model.timeIncrement = 1; // optional

/* Object, Event, and Activity types */
sim.model.objectTypes = [ "RebelGroup", "Enterprise" ];
sim.model.eventTypes = [
  "Income", "Demand", "Extort", "Loot", "Expand", "Fight", "AllocateResource",
  "Report", "Flee"
];
sim.model.activityTypes = [];

/* Global Variables */
sim.model.v.nmrOfRebelGroups = {
  range: "NonNegativeInteger",
  initialValue: 2,
  //label: "Number Rebel Groups",
  //hint: "The number of rebel groups"
};
sim.model.v.nmrOfEnterprises = {
  range: "NonNegativeInteger",
  initialValue: 1000,
  label: "Number Enterprises",
  hint: "The number of enterprises"
};
sim.model.v.nmrOfRebels1 = {
  range: "NonNegativeInteger",
  initialValue: 1000,
  label: "Rebel Group 1 Size",
  hint: "The number of rebels members of rebel group 1"
};
sim.model.v.extortionRate1 = {
  range: "PositiveDecimal",
  initialValue: 0.1,
  label: "Rebel Group 1 Extortion",
  hint: "The extortion rate of rebel group 1",
};
sim.model.v.rebelCost1 = {
  range: "PositiveDecimal",
  initialValue: 291.00,
  label: "Rebel Group 1 Cost",
  hint: "The monthly cost per rebel for rebel group 1"
};
sim.model.v.nmrOfRebels2 = {
  range: "NonNegativeInteger",
  initialValue: 800,
  label: "Rebel Group 2 Size",
  hint: "The number of rebels members of rebel group 2"
};
sim.model.v.rebelCost2 = {
  range: "PositiveDecimal",
  initialValue: 291.00,
  label: "Rebel Group 2 Cost",
  hint: "The monthly cost per rebel for rebel group 2"
};
sim.model.v.extortionRate2 = {
  range: "PositiveDecimal",
  initialValue: 0.1,
  label: "Rebel Group 2 Extortion",
  hint: "The extortion rate of rebel group 2"
};
sim.model.v.fightExpansion = {
  range: "NonNegativeInteger",
  initialValue: 1,
  label: "Fight Expansion",
  hint: "The number of enterprises conquered due to win a fight"
};

/* Global Functions */
/**
 * Calculates the global relative strength of a Rebel Group. The Rebel Group's
 * strength with respect to all other Rebel Groups.
 *
 * @param rebelGroup Rebel Group
 * @return Global relative strength ratio
 */
sim.model.f.globalRelativeStrength = function ( rebelGroup ) {
  var sumOfRebels = 0, globalRelativeStrength = 0;
  var rebelGroupsObj = cLASS[ "RebelGroup" ].instances;

  Object.keys( rebelGroupsObj ).forEach( function ( objId ) {
    sumOfRebels += rebelGroupsObj[ objId ].nmrOfRebels;
  } );

  if ( sumOfRebels > 0 ) {
    globalRelativeStrength = rebelGroup.nmrOfRebels / sumOfRebels;
  }

  return globalRelativeStrength;
};
/**
 * Calculates the relative strength of a Rebel Group with respect to an
 * opponent Rebel Group and returns a value between 0 and 1
 *
 * @param rebelGroup Rebel Group
 * @param opponent Opponent Rebel Group
 * @returns Relative strength of the rebelGroup
 */
sim.model.f.relativeStrength = function ( rebelGroup, opponent ) {
  var relativeStrength = 0;
  var sumOfRebels = rebelGroup.nmrOfRebels + opponent.nmrOfRebels;

  if ( sumOfRebels > 0 ) {
    relativeStrength = rebelGroup.nmrOfRebels / sumOfRebels;
  }

  return relativeStrength;
};
/**
 * Normalize value from [0,1] to [-1,1]
 *
 * @param value Value to normalize
 * @return Normalized value
 */
sim.model.f.normalizeValue = function ( value ) {
  return ( 2 * value ) - 1;
};
/**
 * Calculate the sigmoid function
 * @param a
 * @param b
 * @param c
 * @param d
 * @param e
 * @return Sigmoid function value
 */
sim.model.f.sigmoid = function ( a, b, c, d, e ) {
  return a / ( b + ( c * Math.pow( Math.E, ( -1 * d * e ) ) ) );
};
/*******************************************************************************
 * Define Initial State
 ******************************************************************************/
/* Initial Objects */
sim.scenario.initialState.objects = {};

/* Initial Events */
sim.scenario.initialState.events = [];

/* Initial Functions */
sim.scenario.setupInitialState = function () {
  var rebelGroupsObj, rebelGroupsKey, rebelGroup;
  var enterprisesObj, enterprise, objId;
  var i = sim.v.nmrOfRebelGroups + 1;

  /* Create Rebel Groups */
  sim.addObject( new RebelGroup( {
    id: 1,
    name: "RebelGroup1",
    shortLabel: "rg1",
    wealth: sim.v.nmrOfRebels1 * sim.v.rebelCost1,
    nmrOfRebels: sim.v.nmrOfRebels1,
    rebelCost: sim.v.rebelCost1,
    recruitThreshold: 0.8,
    recruitRate: 0.5,
    extortedEnterprises: [],
    extortionRate: sim.v.extortionRate2,
    reports: {},
    freqDemand: Math.round( rand.normal( 30, 2 ) ),
    freqExpand: Math.round( rand.normal( 5, 2 ) ),
    freqAllocate: 30,
    lastExpand: 0,
    lastAmountExtorted: 0
  } ) );

  sim.scheduleEvent( new Demand( {
    occTime: 1,
    rebelGroup: 1
  } ) );
  sim.scheduleEvent( new Expand( {
    occTime: 1,
    rebelGroup: 1
  } ) );
  sim.scheduleEvent( new AllocateResource( {
    occTime: 30,
    rebelGroup: 1
  } ) );

  sim.addObject( new RebelGroup( {
    id: 2,
    name: "RebelGroup2",
    shortLabel: "rg2",
    wealth: sim.v.nmrOfRebels2 * sim.v.rebelCost2,
    nmrOfRebels: sim.v.nmrOfRebels2,
    rebelCost: sim.v.rebelCost2,
    recruitThreshold: 0.8,
    recruitRate: 0.5,
    extortedEnterprises: [],
    extortionRate: sim.v.extortionRate2,
    reports: {},
    freqDemand: Math.round( rand.normal( 30, 2 ) ),
    freqExpand: Math.round( rand.normal( 5, 2 ) ),
    freqAllocate: 30,
    lastExpand: 0,
    lastAmountExtorted: 0
  } ) );

  sim.scheduleEvent( new Demand( {
    occTime: 1,
    rebelGroup: 2
  } ) );
  sim.scheduleEvent( new Expand( {
    occTime: 1,
    rebelGroup: 2
  } ) );
  sim.scheduleEvent( new AllocateResource( {
    occTime: 30,
    rebelGroup: 2
  } ) );

  /* Create Enterprises */
  for ( ; i <= ( sim.v.nmrOfRebelGroups + sim.v.nmrOfEnterprises ); i += 1 ) {
    objId = i;
    sim.addObject( new Enterprise( {
      id: objId,
      name: "enterprise" + objId,
      income: rand.normal( 200, 50 ),
      freqIncome: 1,
      rebelGroup: null,
      wealth: 0,
      accIncome: 0,
      fleeProb: 0.5,
      fleeThreshold: 3,
      nmrOfExtortions: 0,
      nmrOfLootings: 0
    } ) );

    sim.scheduleEvent( new Income( {
      occTime: 1,
      enterprise: objId
    } ) );
  }

  /* Randomly associate Enterprises and Rebel Groups */
  rebelGroupsObj = cLASS[ "RebelGroup" ].instances;
  rebelGroupsKey = Object.keys( rebelGroupsObj );
  enterprisesObj = cLASS[ "Enterprise" ].instances;
  Object.keys( enterprisesObj ).forEach( function ( objId ) {
    enterprise = enterprisesObj[ objId ];
    rebelGroup = rebelGroupsObj[ rebelGroupsKey[ rand.uniformInt( 0,
      rebelGroupsKey.length - 1 ) ] ];

    enterprise.rebelGroup = rebelGroup;
    rebelGroup.extortedEnterprises =
      rebelGroup.extortedEnterprises.concat( enterprise );
  } );
};
/*******************************************************************************
 * Define Output Statistics Variables
 ******************************************************************************/
sim.model.statistics = {
  "nmrOfExtortions": {
    range: "NonNegativeInteger",
    label: "Number Extortions",
    initialValue: 0,
    // showTimeSeries: true,
    // computeOnlyAtEnd: false
  },
  "nmrOfLoots": {
    range: "NonNegativeInteger",
    label: "Number Lootings",
    initialValue: 0,
    // showTimeSeries: true,
    // computeOnlyAtEnd: false
  },
  "nmrOfExpands": {
    range: "NonNegativeInteger",
    label: "Number Expansions",
    initialValue: 0
  },
  "nmrOfFights": {
    range: "NonNegativeInteger",
    label: "Number Fights",
    initialValue: 0
  },
  "nmrOfReports": {
    range: "NonNegativeInteger",
    label: "Number Reports",
    initialValue: 0
  },
  "nmrOfFlees": {
    range: "NonNegativeInteger",
    label: "Number Fled Ent.",
    initialValue: 0,
    showTimeSeries: true,
    computeOnlyAtEnd: false
  },
  "nmrOfRecruits": {
    range: "NonNegativeInteger",
    label: "Number Recruitments",
    initialValue: 0
  },
  "nmrOfExpels": {
    range: "NonNegativeInteger",
    label: "Number Expels",
    initialValue: 0
  },
  // "amountExtorted": {
  //   range: "Decimal",
  //   label: "Amount Extorted",
  //   initialValue: 0
  // },
  // "amountLooted": {
  //   range: "Decimal",
  //   label: "Amount Looted",
  //   initialValue: 0
  // },
  // "nmrOfRebels": {
  //   range: "NonNegativeInteger",
  //   label: "Number of Rebels",
  //   initialValue: 0,
  //   showTimeSeries: true,
  //   computeOnlyAtEnd: false,
  //   expression: function () {
  //     var total = 0;
  //     var rebelGroupsObj = cLASS[ "RebelGroup" ].instances;
  //     Object.keys( rebelGroupsObj ).forEach( function ( objId ) {
  //       total += rebelGroupsObj[ objId ].nmrOfRebels;
  //     } );
  //     return total;
  //   }
  // },
  "nmrOfRebels1": {
    range: "NonNegativeInteger",
    label: "Size of Rebel Group 1",
    initialValue: 0,
    showTimeSeries: true,
    computeOnlyAtEnd: false,
    expression: function () {
      var rebelGroupObj = cLASS[ "RebelGroup" ].instances[ 1 ];

      return rebelGroupObj.nmrOfRebels;
    }
  },
  "nmrOfRebels2": {
    range: "NonNegativeInteger",
    label: "Size of Rebel Group 2",
    initialValue: 0,
    showTimeSeries: true,
    computeOnlyAtEnd: false,
    expression: function () {
      var rebelGroupObj = cLASS[ "RebelGroup" ].instances[ 2 ];

      return rebelGroupObj.nmrOfRebels;
    }
  },
  // "nmrOfRebels3": {
  //   range: "NonNegativeInteger",
  //   label: "Number of Rebels (3)",
  //   initialValue: 0,
  //   showTimeSeries: true,
  //   computeOnlyAtEnd: false,
  //   expression: function () {
  //     var rebelGroupObj = cLASS[ "RebelGroup" ].instances[ 3 ];

  //     return rebelGroupObj.nmrOfRebels;
  //   }
  // },
  // "nmrOfExtortedEnterprises": {
  //   range: "NonNegativeInteger",
  //   label: "Number of Extorted Enterprises",
  //   initialValue: 0,
  //   showTimeSeries: true,
  //   computeOnlyAtEnd: false,
  //   expression: function () {
  //     var total = 0;
  //     var rebelGroupsObj = cLASS[ "RebelGroup" ].instances;
  //     Object.keys( rebelGroupsObj ).forEach( function ( objId ) {
  //       total += rebelGroupsObj[ objId ].extortedEnterprises.length;
  //     } );
  //     return total;
  //   }
  // },
  "nmrOfExtorted1": {
    range: "NonNegativeInteger",
    label: "Enterprises Extorted by Group 1",
    initialValue: 0,
    showTimeSeries: true,
    computeOnlyAtEnd: false,
    expression: function () {
      var rebelGroupObj = cLASS[ "RebelGroup" ].instances[ 1 ];

      return rebelGroupObj.extortedEnterprises.length;
    }
  },
  "nmrOfExtorted2": {
    range: "NonNegativeInteger",
    label: "Enterprises Extorted by Group 2",
    initialValue: 0,
    showTimeSeries: true,
    computeOnlyAtEnd: false,
    expression: function () {
      var rebelGroupObj = cLASS[ "RebelGroup" ].instances[ 2 ];

      return rebelGroupObj.extortedEnterprises.length;
    }
  },
  // "nmrOfExtorted3": {
  //   range: "NonNegativeInteger",
  //   label: "Number of Extorted Enterprises (3)",
  //   initialValue: 0,
  //   showTimeSeries: true,
  //   computeOnlyAtEnd: false,
  //   expression: function () {
  //     var rebelGroupObj = cLASS[ "RebelGroup" ].instances[ 3 ];

  //     return rebelGroupObj.extortedEnterprises.length;
  //   }
  // },
  // "wealth1": {
  //   range: "Decimal",
  //   label: "Wealth Rebel Group (1)",
  //   initialValue: 0,
  //   showTimeSeries: true,
  //   computeOnlyAtEnd: false,
  //   expression: function () {
  //     var rebelGroupObj = cLASS[ "RebelGroup" ].instances[ 1 ];

  //     return rebelGroupObj.wealth;
  //   }
  // },
  // "wealth2": {
  //   range: "Decimal",
  //   label: "Wealth Rebel Group (2)",
  //   initialValue: 0,
  //   showTimeSeries: true,
  //   computeOnlyAtEnd: false,
  //   expression: function () {
  //     var rebelGroupObj = cLASS[ "RebelGroup" ].instances[ 2 ];

  //     return rebelGroupObj.wealth;
  //   }
  // }
};