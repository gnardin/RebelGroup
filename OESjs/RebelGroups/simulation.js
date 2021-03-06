/*******************************************************************************
 * Rebel Groups simulation model
 *
 * @copyright Copyright 2018-2019 Brandenburg University of Technology, Germany
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
// sim.scenario.randomSeed = 1234; // optional
/*******************************************************************************
 * Simulation Config
 ******************************************************************************/
// sim.config.stepDuration = 0; // optional
// sim.config.runInMainThread = true; // optional
// sim.config.createLog = false; // optional
// sim.config.userInteractive = false; // optional
// sim.config.visualize = true; // optional
// sim.model.space.type = "IntegerGrid";
// sim.model.space.xMax = 1;
// sim.model.space.yMax = 1;
/*******************************************************************************
 * Simulation Model
 ******************************************************************************/
sim.model.time = "discrete";
sim.model.timeUnit = "D"; // D = days
sim.model.timeIncrement = 1; // optional

/* Object, Event, and Activity types */
sim.model.objectTypes = [ "RebelGroup", "Enterprise" ];
sim.model.eventTypes = [ "Income", "Demand", "Extort", "Loot", "Expand",
  "Fight", "AllocateWealth", "Report", "Flee"
];
sim.model.activityTypes = [];

/* Global Variables */
sim.model.v.nmrOfEnterprises = {
  range: "NonNegativeInteger",
  initialValue: 3000,
  label: "Number Enterprises",
  hint: "The number of Enterprises"
};
sim.model.v.income = {
  range: "string",
  initialValue: "[200,50]",
  label: "Ents Income",
  hint: "The income of the Enterprises (Normal)"
};
sim.model.v.freqIncome = {
  range: "string",
  initialValue: "[1,1]",
  label: "Ents Income Frequency",
  hint: "The frequency the Enterprises receive income (UniformInt)"
};
sim.model.v.fleeProb = {
  range: "string",
  initialValue: "[0.5,0.5]",
  label: "Ents Flee Probability",
  hint: "The probability an Enterprise flees (Uniform [0,1])"
};
sim.model.v.fleeThreshold = {
  range: "string",
  initialValue: "[3,3]",
  label: "Ents Flee Threshold",
  hint: "The threshold an Enterprise flees (UniformInt)"
};
sim.model.v.nmrOfRebelGroups = {
  range: "NonNegativeInteger",
  initialValue: 3,
  label: "Number Rebel Groups",
  hint: "The number of Rebel Groups"
};
sim.model.v.nmrOfRebels = {
  range: "string",
  initialValue: "[300,300,300]",
  label: "RG Rebel Members",
  hint: "The number of rebel members per Rebel Group"
};
sim.model.v.propOfEnterprises = {
  range: "string",
  initialValue: "[0.34,0.33,0.33]",
  label: "RG Prop Enterprises",
  hint: "The proportion of Enterprises per Rebel Group"
};
sim.model.v.extortionRates = {
  range: "string",
  initialValue: "[0.1,0.1,0.1]",
  label: "RG Extortion Rate",
  hint: "The extortion rate per Rebel Group"
};
sim.model.v.rebelCosts = {
  range: "string",
  initialValue: "[291,291,291]",
  label: "RG Rebel Cost",
  hint: "The monthly cost per rebel per Rebel Group"
};
sim.model.v.recruitThreshold = {
  range: "string",
  initialValue: "[0.8,0.8,0.8]",
  label: "RG Recruit Threshold",
  hint: "The threshold to stop recruiting per Rebel Group"
};
sim.model.v.recruitRate = {
  range: "string",
  initialValue: "[0.5,0.5,0.5]",
  label: "RG Recruit Rate",
  hint: "The rate of rebels recruited per recruitment per Rebel Group"
};
sim.model.v.freqDemand = {
  range: "string",
  initialValue: "[[30,2],[30,2],[30,2]]",
  label: "RG Demand Frequency",
  hint: "The frequency each Rebel Group demand extortion money (Normal)"
};
sim.model.v.freqExpand = {
  range: "string",
  initialValue: "[[30,2],[30,2],[30,2]]",
  label: "RGs Expansion Frequency",
  hint: "The frequency each Rebel Group try to expand their domain (Normal)"
};
sim.model.v.fightExpansion = {
  range: "NonNegativeInteger",
  initialValue: 50,
  label: "Fight Expansion",
  hint: "The number of enterprises conquered due to win a fight"
};
sim.model.v.traceObjId = {
  range: "Object",
  initialValue: []
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
  var sumOfRebels, globalRelativeStrength;
  var rebelGroupsObj = cLASS[ "RebelGroup" ].instances;

  sumOfRebels = 0;
  Object.keys( rebelGroupsObj ).forEach( function ( objId ) {
    sumOfRebels += rebelGroupsObj[ objId ].nmrOfRebels;
  } );

  globalRelativeStrength = 0;
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
 * @returns Relative strength of the rebelGroups
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
/**
 * Create a log trace for specific objects whose Ids are specified at
 * sim.model.v.traceObjIds
 *
 * @param obj Object
 * @param text Text to print on the console
 */
sim.model.f.logObj = function ( objIds, text ) {
  var log = false;

  if ( Array.isArray( objIds ) ) {
    objIds.forEach( ( objId ) => {
      if ( sim.v.traceObjId.includes( objId ) ) {
        log = true;
      }
    } );
  } else if ( Number.isInteger( objIds ) &&
    ( sim.v.traceObjId.includes( objIds ) ) ) {
    log = true;
  }

  if ( log ) {
    console.log( text );
  }
};
/*******************************************************************************
 * Define Experiments
 ******************************************************************************/
sim.experiment.id = 1;
sim.experiment.experimentNo = 1;
sim.experiment.title = "Basic";
sim.experiment.parameterDefs = [
  new oes.ExperimentParamDef( {
    name: "nmrOfRebels",
    values: [
      "[300,300,300]",
      "[300,150,150]",
      "[300,150,75]"
    ]
  } ),
  new oes.ExperimentParamDef( {
    name: "propOfEnterprises",
    values: [
      "[0.34,0.33,0.33]",
      "[0.5,0.25,0.25]",
      "[0.6,0.3,0.1]"
    ]
  } )
];
sim.experiment.replications = 100;
sim.experiment.seeds = [ 3078, 2577, 5523, 564, 4684, 4836, 8120, 3701, 5462, 1702, 6244, 8812, 2801, 3980, 7615, 6681, 2043, 3570, 3589, 6890, 5348, 7094, 5372, 7473, 4191, 1710, 7683, 8796, 5476, 2770, 5427, 601, 5550, 4275, 5514, 3762, 1341, 9545, 8908, 8602, 6035, 672, 9671, 9532, 5511, 6110, 1310, 4025, 9342, 9309, 5948, 5433, 4197, 6753, 1553, 8068, 849, 3120, 6931, 4209, 1045, 178, 2068, 8163, 6135, 166, 3044, 2564, 7831, 5680, 8588, 3074, 2557, 9196, 7403, 9179, 9029, 1278, 957, 6944, 4213, 8826, 47, 6997, 9111, 7252, 6552, 4483, 5634, 7193, 9581, 8704, 1598, 6418, 1650, 77, 9490, 7078, 4215, 2377 ];
sim.experiment.storeEachExperimentScenarioRun = true;
/*******************************************************************************
 * Define Initial State
 ******************************************************************************/
/* Initial Objects */
sim.scenario.initialState.objects = {};

/* Initial Events */
sim.scenario.initialState.events = [];

/* Initial Functions */
sim.scenario.setupInitialState = function () {
  var rebelGroupsObj, rebelGroupsKeys, rebelGroup;
  var enterprisesObj, enterprise;
  var objId, i;
  var nmrEnts = {};
  var totalProp = 0;

  // Enterprises input parameters
  var income = JSON.parse( sim.v.income );
  var freqIncome = JSON.parse( sim.v.freqIncome );
  var fleeProb = JSON.parse( sim.v.fleeProb );
  var fleeThreshold = JSON.parse( sim.v.fleeThreshold );

  // Rebel Groups input parameters
  var nmrOfRebels = JSON.parse( sim.v.nmrOfRebels );
  var propOfEnterprises =
    JSON.parse( sim.v.propOfEnterprises ).slice( 0, sim.v.nmrOfRebelGroups );
  var extortionRates =
    JSON.parse( sim.v.extortionRates ).slice( 0, sim.v.nmrOfRebelGroups );
  var rebelCosts =
    JSON.parse( sim.v.rebelCosts ).slice( 0, sim.v.nmrOfRebelGroups );
  var recruitThreshold =
    JSON.parse( sim.v.recruitThreshold ).slice( 0, sim.v.nmrOfRebelGroups );
  var recruitRate =
    JSON.parse( sim.v.recruitRate ).slice( 0, sim.v.nmrOfRebelGroups );
  var freqDemand =
    JSON.parse( sim.v.freqDemand ).slice( 0, sim.v.nmrOfRebelGroups );
  var freqExpand =
    JSON.parse( sim.v.freqExpand ).slice( 0, sim.v.nmrOfRebelGroups );

  /* Create Rebel Groups */
  for ( i = 0; i < sim.v.nmrOfRebelGroups; i += 1 ) {
    objId = i + 1;

    rebelGroup = new RebelGroup( {
      id: objId,
      name: "RebelGroup" + objId,
      shortLabel: "rg" + objId,
      wealth: nmrOfRebels[ i ] * rebelCosts[ i ],
      nmrOfRebels: nmrOfRebels[ i ],
      rebelCost: rebelCosts[ i ],
      recruitThreshold: recruitThreshold[ i ],
      recruitRate: recruitRate[ i ],
      extortedEnterprises: [],
      extortionRate: extortionRates[ i ],
      reports: {},
      freqDemand: Math.abs( Math.round( rand.normal( freqDemand[ i ][ 0 ],
        freqDemand[ i ][ 1 ] ) ) ),
      freqExpand: Math.abs( Math.round( rand.normal( freqExpand[ i ][ 0 ],
        freqExpand[ i ][ 1 ] ) ) ),
      lastExpand: 0,
      lastAmountCollected: 0
    } );

    sim.addObject( rebelGroup );

    sim.scheduleEvent( new Demand( {
      occTime: 1,
      rebelGroup: objId
    } ) );
    sim.scheduleEvent( new Expand( {
      occTime: 1,
      rebelGroup: objId
    } ) );
  }

  /* Create Enterprises */
  for ( ; i < ( sim.v.nmrOfRebelGroups + sim.v.nmrOfEnterprises ); i += 1 ) {
    objId = i + 1;

    enterprise = new Enterprise( {
      id: objId,
      name: "enterprise" + objId,
      wealth: 0,
      rebelGroup: null,
      income: rand.normal( income[ 0 ], income[ 1 ] ),
      freqIncome: rand.uniformInt( freqIncome[ 0 ], freqIncome[ 1 ] ),
      accIncome: 0,
      fleeProb: rand.uniform( fleeProb[ 0 ], fleeProb[ 1 ] ),
      fleeThreshold: rand.uniformInt( fleeThreshold[ 0 ], fleeThreshold[ 1 ] ),
      nmrOfExtortions: 0,
      nmrOfLootings: 0
    } );

    sim.addObject( enterprise );

    sim.scheduleEvent( new Income( {
      occTime: 1,
      enterprise: objId
    } ) );
  }

  /* Adjust the proportion of Enterprises */
  totalProp = propOfEnterprises.reduce( ( total, value ) => total + value, 0 );

  rebelGroupsObj = cLASS[ "RebelGroup" ].instances;
  rebelGroupsKeys = Object.keys( rebelGroupsObj );

  rebelGroupsKeys.reduce( ( total, rebelGroupId, index ) => {
    nmrEnts[ rebelGroupId ] = Math.min( sim.v.nmrOfEnterprises -
      total, Math.ceil( ( propOfEnterprises[ index ] / totalProp ) *
        sim.v.nmrOfEnterprises ) );

    total += nmrEnts[ rebelGroupId ];
    return total;
  }, 0 );

  /* Randomly associate Enterprises with Rebel Groups */
  enterprisesObj = cLASS[ "Enterprise" ].instances;
  Object.keys( enterprisesObj ).forEach( function ( id ) {
    enterprise = enterprisesObj[ id ];

    do {
      objId = rebelGroupsKeys[ rand.uniformInt( 0,
        rebelGroupsKeys.length - 1 ) ];
    } while ( nmrEnts[ objId ] === 0 );
    rebelGroup = rebelGroupsObj[ objId ];

    nmrEnts[ objId ] -= 1;
    if ( nmrEnts[ objId ] === 0 ) {
      rebelGroupsKeys.splice( rebelGroupsKeys.indexOf( objId ), 1 );
    }

    enterprise.rebelGroup = rebelGroup;
    rebelGroup.extortedEnterprises.push( enterprise );
  } );

  /*****************************************************************************
   * Define Output Statistics Variables
   ****************************************************************************/
  sim.model.statistics = {
    "nmrOfExtortions": {
      range: "NonNegativeInteger",
      label: "Number Extortions",
      initialValue: 0
    },
    "nmrOfLoots": {
      range: "NonNegativeInteger",
      label: "Number Lootings",
      initialValue: 0
    },
    "nmrOfExpands": {
      range: "NonNegativeInteger",
      label: "Number Expansions",
      initialValue: 0
    },
    "nmrOfAlliances": {
      range: "NonNegativeInteger",
      label: "Number Alliances",
      initialValue: 0
    },
    "sumOfFights": {
      range: "NonNegativeInteger",
      label: "Number Fights",
      initialValue: 0
    },
    "nmrOfFights": {
      range: "NonNegativeInteger",
      label: "Number Fights",
      initialValue: 0,
      showTimeSeries: true,
      computeOnlyAtEnd: false
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
    "nmrOfDeaths": {
      range: "NonNegativeInteger",
      label: "Number Deaths",
      initialValue: 0,
      showTimeSeries: true,
      computeOnlyAtEnd: false
    }
  };

  // Rebel Group's Size
  Object.keys( rebelGroupsObj ).forEach( function ( id ) {
    sim.model.statistics[ "nmrOfRebels" + id ] = {
      objectType: "RebelGroup",
      objectIdRef: id,
      property: "nmrOfRebels",
      label: "Size Rebel Group " + id,
      initialValue: 0,
      showTimeSeries: true
    };
  } );

  // Rebel Group's Number of Extorted Enterprise
  Object.keys( rebelGroupsObj ).forEach( function ( id ) {
    sim.model.statistics[ "nmrOfExtorted" + id ] = {
      range: "NonNegativeInteger",
      label: "Enterprises Extorted by Rebel Group " + id,
      initialValue: 0,
      showTimeSeries: true,
      computeOnlyAtEnd: false,
      expression: function () {
        var rebelGroupObj = cLASS[ "RebelGroup" ].instances[ id ];
        return rebelGroupObj.extortedEnterprises.length;
      }
    };
  } );

  // Rebel Group's Alive
  Object.keys( rebelGroupsObj ).forEach( function ( id ) {
    sim.model.statistics[ "alive" + id ] = {
      range: "NonNegativeInteger",
      label: "Alive Rebel Group " + id,
      initialValue: 0,
      showTimeSeries: false,
      computeOnlyAtEnd: true,
      expression: function () {
        var rebelGroupObj = cLASS[ "RebelGroup" ].instances[ id ];
        if ( rebelGroupObj.nmrOfRebels > 0 ) {
          return 1; // Alive
        } else {
          return 0; // Dead
        }
      }
    };
  } );
};
sim.model.statistics = {};