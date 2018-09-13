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
sim.scenario.randomSeed = 1234; // optional
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
  label: "Number Rebel Groups",
  hint: "The number of rebel groups"
};
sim.model.v.nmrOfEnterprises = {
  range: "NonNegativeInteger",
  initialValue: 1000,
  label: "Number Enterprises",
  hint: "The number of enterprises"
};
sim.model.v.basket = {
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
}
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
  var enterprisesObj, enterprise;
  var aux, objId;
  var i = sim.v.nmrOfRebelGroups + 1;

  /* Create Rebel Groups */
  sim.addObject( new RebelGroup( {
    id: 1,
    name: "RebelGroup1",
    shortLabel: "rg1",
    wealth: 1050,
    nmrOfRebels: 500,
    rebelCost: 2,
    freezeExpandThreshold: 0.8,
    expandRate: 0.1,
    extortedEnterprises: [],
    extortionRate: 0.3,
    reports: {},
    freqDemand: Math.round( rand.normal( 30, 5 ) ),
    freqExpand: Math.round( rand.normal( 100, 2 ) ),
    freqAllocate: 30,
    lastExpand: 0,
    lastWealth: 0
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
    occTime: 1,
    rebelGroup: 1
  } ) );

  sim.addObject( new RebelGroup( {
    id: 2,
    name: "RebelGroup2",
    shortLabel: "rg2",
    wealth: 250,
    nmrOfRebels: 100,
    rebelCost: 2,
    freezeExpandThreshold: 0.8,
    expandRate: 0.1,
    extortedEnterprises: [],
    extortionRate: 0.2,
    reports: {},
    freqDemand: Math.round( rand.normal( 30, 5 ) ),
    freqExpand: Math.round( rand.normal( 100, 2 ) ),
    freqAllocate: 30,
    lastExpand: 0,
    lastWealth: 0
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
    occTime: 1,
    rebelGroup: 2
  } ) );

  // sim.addObject( new RebelGroup( {
  //   id: 3,
  //   name: "RebelGroup3",
  //   shortLabel: "rg3",
  //   wealth: 250,
  //   nmrOfRebels: 100,
  //   rebelCost: 2,
  //   freezeExpandThreshold: 0.8,
  //   expandRate: 0.1,
  //   extortedEnterprises: [],
  //   extortionRate: 0.2,
  //   reports: {},
  //   freqDemand: Math.round( rand.normal( 30, 5 ) ),
  //   freqExpand: Math.round( rand.normal( 100, 2 ) ),
  //   freqAllocate: 30,
  //   lastExpand: 0,
  //   lastWealth: 0
  // } ) );

  // sim.scheduleEvent( new Demand( {
  //   occTime: 1,
  //   rebelGroup: 3
  // } ) );
  // sim.scheduleEvent( new Expand( {
  //   occTime: 1,
  //   rebelGroup: 3
  // } ) );
  // sim.scheduleEvent( new AllocateResource( {
  //   occTime: 1,
  //   rebelGroup: 3
  // } ) );

  /* Create Enterprises */
  aux = Math.round( sim.v.nmrOfEnterprises * 0.2 );
  for ( ; i <= ( sim.v.nmrOfRebelGroups + aux ); i += 1 ) {
    objId = i;
    sim.addObject( new Enterprise( {
      id: objId,
      name: "enterprise" + objId,
      income: rand.normal( 100, 10 ),
      freqIncome: 1,
      rebelGroup: null,
      wealth: 0,
      accIncome: 0,
      fleeProb: 0.5,
      fleeThreshold: 3,
      nmrOfExtortions: 0,
      nmrOfLoot: 0
    } ) );

    sim.scheduleEvent( new Income( {
      occTime: 1,
      enterprise: objId
    } ) );
  }

  for ( ; i <= ( sim.v.nmrOfRebelGroups + sim.v.nmrOfEnterprises ); i += 1 ) {
    objId = i;
    sim.addObject( new Enterprise( {
      id: objId,
      name: "enterprise" + objId,
      income: rand.normal( 5, 1 ),
      freqIncome: 1,
      rebelGroup: null,
      wealth: 0,
      accIncome: 0,
      fleeProb: 0.5,
      fleeThreshold: 3,
      nmrOfExtortions: 0,
      nmrOfLoot: 0
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
  "nmrOfLoot": {
    range: "NonNegativeInteger",
    label: "Number Loot",
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
    label: "Number Flees",
    initialValue: 0
  },
  "nmrOfRecruits": {
    range: "NonNegativeInteger",
    label: "Number Recruitment",
    initialValue: 0
  },
  "nmrOfExpels": {
    range: "NonNegativeInteger",
    label: "Number Expels",
    initialValue: 0
  },
  "amountExtorted": {
    range: "Decimal",
    label: "Amount Extorted",
    initialValue: 0
  },
  "amountLoot": {
    range: "Decimal",
    label: "Amount Loot",
    initialValue: 0
  },
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
    label: "Number of Rebels (1)",
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
    label: "Number of Rebels (2)",
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
    label: "Number of Extorted Enterprises (1)",
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
    label: "Number of Extorted Enterprises (2)",
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