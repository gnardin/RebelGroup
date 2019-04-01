/*******************************************************************************
 * Flee event class
 *
 * @copyright Copyright 2018-2019 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Flee = new cLASS( {
  Name: "Flee",
  supertypeName: "eVENT",
  properties: {
    "enterprise": { range: "Enterprise", label: "Enterprise" }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var rebelGroup, index;
      var rebelGroupsObj = cLASS[ "RebelGroup" ].instances;
      var enterprisesKey = Object.keys( cLASS[ "Enterprise" ].instances );

      Object.keys( rebelGroupsObj ).forEach( ( objId ) => {
        rebelGroup = rebelGroupsObj[ objId ];

        index = rebelGroup.extortedEnterprises.indexOf( this.enterprise );
        if ( index !== -1 ) {
          rebelGroup.extortedEnterprises.splice( index, 1 );
        }
      } );

      if ( enterprisesKey.indexOf( String( this.enterprise.id ) ) !== -1 ) {
        sim.removeObject( this.enterprise );
        sim.stat.nmrOfFlees += 1;
      }

      return followupEvents;
    }
  }
} );
Flee.priority = 3;