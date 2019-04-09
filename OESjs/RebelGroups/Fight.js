/*******************************************************************************
 * Fight event class
 *
 * @copyright Copyright 2018-2019 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var Fight = new cLASS( {
  Name: "Fight",
  supertypeName: "eVENT",
  properties: {
    "attacker": { range: "RebelGroup", label: "Attacker" },
    "opponent": { range: "RebelGroup", label: "Opponent" }
  },
  methods: {
    "onEvent": function () {
      var followupEvents = [];
      var index, len, i, j, s, t, v;
      var enterprise, enterprises;
      var ally, allyProb, allied, attackerAlliance, opponentAlliance;
      var strong, strongProb;
      var weak, weakProb;
      var nmrOfExtorted, nmrOfRebels, nmrOfDeaths, totalDeaths;
      var nmrOfTransfers, totalTransfers;
      var rebelGroup, rebelGroups, rebelGroupsKeys;

      rebelGroups = cLASS[ "RebelGroup" ].instances;
      rebelGroupsKeys = Object.keys( rebelGroups );

      // Logging
      sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
        "\nTimestep " + this.occTime +
        "\nAction: Fight" +
        "\nAttacker (Rebel Group " + this.attacker.id + ")" +
        "\n  Nmr of Rebels = " + this.attacker.nmrOfRebels +
        "\n  Nmr of Enterprises = " +
        this.attacker.extortedEnterprises.length +
        "\nOpponent (Rebel Group " + this.opponent.id + ")" +
        "\n  Nmr of Rebels = " + this.opponent.nmrOfRebels +
        "\n  Nmr of Enterprises = " +
        this.opponent.extortedEnterprises.length );

      /* Define whether to Form Alliance */
      ally = false;
      if ( this.attacker.nmrOfRebels > this.opponent.nmrOfRebels ) {
        allyProb = ( sim.model.f.globalRelativeStrength( this.attacker ) -
          sim.model.f.globalRelativeStrength( this.opponent ) );

        if ( rand.uniform() < allyProb ) {
          ally = true;
        }
      }

      /* Choose an Ally */
      attackerAlliance = {
        leader: this.attacker,
        members: [ this.attacker.id ],
        nmrOfExtorted: this.attacker.extortedEnterprises.length,
        nmrOfRebels: this.attacker.nmrOfRebels
      };
      opponentAlliance = {
        leader: this.opponent,
        members: [ this.opponent.id ],
        nmrOfExtorted: this.opponent.extortedEnterprises.length,
        nmrOfRebels: this.opponent.nmrOfRebels
      };
      if ( ally ) {
        rebelGroupsKeys.splice(
          rebelGroupsKeys.indexOf( this.attacker.id ), 1 );
        rebelGroupsKeys.splice(
          rebelGroupsKeys.indexOf( this.opponent.id ), 1 );
        rand.shuffleArray( rebelGroupsKeys );

        allied = false;
        for ( i = 0; ( i < rebelGroupsKeys.length ) & !allied; i += 1 ) {
          rebelGroup = rebelGroups[ rebelGroupsKeys[ i ] ];
          if ( ( !attackerAlliance.members.includes( rebelGroup.id ) ) &&
            ( ( !opponentAlliance.members.includes( rebelGroup.id ) ) ) &&
            ( ( opponentAlliance.nmrOfRebels + rebelGroup.nmrOfRebels ) >
              attackerAlliance.nmrOfRebels ) ) {

            sim.model.f.logObj( [ this.attacker.id, this.opponent.id,
            rebelGroup.id ],
              "Action: Fight as Alliance (Rebel Group " +
              rebelGroup.id + ")" +
              "\n  Nmr of Rebels = " + rebelGroup.nmrOfRebels +
              "\n  Nmr of Enterprises = " +
              rebelGroup.extortedEnterprises.length );

            opponentAlliance.members.push( rebelGroup.id );
            opponentAlliance.nmrOfExtorted +=
              rebelGroup.extortedEnterprises.length;
            opponentAlliance.nmrOfRebels += rebelGroup.nmrOfRebels;
            allied = true;

            sim.stat.nmrOfAlliances += 1;
          }
        }
      }

      /* Define the strong and weak rebel groups */
      if ( attackerAlliance.nmrOfRebels > opponentAlliance.nmrOfRebels ) {
        strong = attackerAlliance;
        weak = opponentAlliance;
      } else {
        strong = opponentAlliance;
        weak = attackerAlliance;
      }

      // Rebel Groups fight only if both have rebels
      if ( ( strong.nmrOfRebels > 0 ) && ( weak.nmrOfRebels > 0 ) ) {
        strongProb = sim.model.f.relativeStrength( strong, weak );
        weakProb = sim.model.f.relativeStrength( weak, strong );

        // Probability the strong Rebel Group wins the fight
        if ( rand.uniform() < strongProb ) {

          // Define number of Enterprises to transfer
          len = Math.min( weak.nmrOfExtorted, sim.v.fightExpansion );

          // Logging
          sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
            "Strong Alliance Wins" );

          // Proportion to transfer from each weak Rebel Group
          totalTransfers = 0;
          nmrOfTransfers = Array( weak.members.length ).fill( 0 );
          if ( sim.v.fightModel === 1 ) {
            // Proportion based on number of enterprises
            if ( weak.members.length === 1 ) {
              nmrOfTransfers[ 0 ] = Math.min( weak.nmrOfExtorted, len );
            } else {
              for ( i = 0; i < weak.members.length; i += 1 ) {
                nmrOfExtorted =
                  rebelGroups[ weak.members[ i ] ].extortedEnterprises.length;
                nmrOfRebels = rebelGroups[ weak.members[ i ] ].nmrOfRebels;
                nmrOfTransfers[ i ] = Math.min( Math.ceil( nmrOfExtorted *
                  ( 1 - ( nmrOfRebels / weak.nmrOfRebels ) ) ),
                  len - totalTransfers );
                totalTransfers += nmrOfTransfers[ i ];
              }
            }
          } else if ( sim.v.fightModel === 2 ) {
            // Proportion based on strength
            s = [];
            s[ 0 ] = 1 / rebelGroups[ weak.members[ 0 ] ].nmrOfRebels;
            for ( i = 1; i < weak.members.length; i += 1 ) {
              s[ i ] = s[ i - 1 ] +
                ( 1 / rebelGroups[ weak.members[ i ] ].nmrOfRebels );
            }

            i = len;
            while ( i > 0 ) {
              t = rand.uniform( 0, 1 );
              j = -1;
              do {
                j += 1;
                v = s[ j ] / s[ s.length - 1 ];
              } while ( v < t );

              if ( nmrOfTransfers[ j ] < rebelGroups[
                weak.members[ j ] ].extortedEnterprises.length ) {
                nmrOfTransfers[ j ] += 1;
                i -= 1;
              }
            }
          }

          // Logging
          sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
            "LOSER REBEL GROUPS" );

          // Select random Enterprises from weak Rebel Group
          enterprises = [];
          for ( i = 0; i < weak.members.length; i += 1 ) {
            rebelGroup = rebelGroups[ weak.members[ i ] ];

            // Logging
            sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
              "Rebel Group " + rebelGroup.id +
              " Nmr Enterprises BEFORE " +
              rebelGroup.extortedEnterprises.length );

            for ( j = 0; j < nmrOfTransfers[ i ]; j += 1 ) {
              index = rand.uniformInt( 0,
                rebelGroup.extortedEnterprises.length - 1 );
              enterprises.push( rebelGroup.extortedEnterprises[ index ] );
              rebelGroup.extortedEnterprises.splice( index, 1 );
            }

            // Logging
            sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
              "Rebel Group " + rebelGroup.id +
              " Nmr Enterprises AFTER " +
              rebelGroup.extortedEnterprises.length );
          }

          // Proportion to transfer to each strong Rebel Group
          totalTransfers = 0;
          nmrOfTransfers = Array( strong.members.length ).fill( 0 );
          for ( i = 0; i < strong.members.length; i += 1 ) {
            nmrOfRebels = rebelGroups[ strong.members[ i ] ].nmrOfRebels;
            nmrOfTransfers[ i ] = Math.min( Math.ceil( enterprises.length *
              ( nmrOfRebels / strong.nmrOfRebels ) ), len - totalTransfers );
            totalTransfers += nmrOfTransfers[ i ];
          }

          // Logging
          sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
            "WINNER REBEL GROUPS" );

          // Transfer Enterprises to strong Rebel Groups
          rand.shuffleArray( enterprises );
          for ( i = 0; i < strong.members.length; i += 1 ) {
            rebelGroup = rebelGroups[ strong.members[ i ] ];

            // Logging
            sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
              "Rebel Group " + rebelGroup.id +
              " Nmr Enterprises BEFORE " +
              rebelGroup.extortedEnterprises.length );

            for ( j = 0; j < nmrOfTransfers[ i ]; j += 1 ) {
              enterprise = enterprises.splice( 0, 1 )[ 0 ];
              enterprise.rebelGroup = rebelGroup;
              enterprise.nmrOfLootings = 0;
              rebelGroup.extortedEnterprises.push( enterprise );
            }

            // Logging
            sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
              "Rebel Group " + rebelGroup.id +
              " Nmr Enterprises AFTER " +
              rebelGroup.extortedEnterprises.length );
          }
        } else {

          // Probability the weak Rebel Group wins the fight
          if ( rand.uniform() < weakProb ) {

            // Define number of Enterprises to transfer
            len = Math.min( strong.nmrOfExtorted, sim.v.fightExpansion );

            // Logging
            sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
              "Weak Alliance Wins" +
              "\nNmr Enterprises Transfer = " + len +
              "\nNmr Strong Extorted = " + strong.nmrOfExtorted );

            // Proportion to transfer from each strong Rebel Group
            totalTransfers = 0;
            nmrOfTransfers = Array( strong.members.length ).fill( 0 );
            if ( sim.v.fightModel === 1 ) {
              // Proportion based on number of enterprises
              if ( strong.members.length === 1 ) {
                nmrOfTransfers[ 0 ] = Math.min( strong.nmrOfExtorted, len );
              } else {
                for ( i = 0; i < strong.members.length; i += 1 ) {
                  nmrOfExtorted =
                    rebelGroups[ strong.members[ i ] ].extortedEnterprises.length;
                  nmrOfRebels = rebelGroups[ strong.members[ i ] ].nmrOfRebels;
                  nmrOfTransfers[ i ] = Math.min( Math.ceil( nmrOfExtorted *
                    ( 1 - ( nmrOfRebels / strong.nmrOfRebels ) ) ),
                    len - totalTransfers );
                  totalTransfers += nmrOfTransfers[ i ];
                }
              }
            } else if ( sim.v.fightModel === 2 ) {
              // Proportion based on strength
              s = [];
              s[ 0 ] = 1 / rebelGroups[ strong.members[ 0 ] ].nmrOfRebels;
              for ( i = 1; i < strong.members.length; i += 1 ) {
                s[ i ] = s[ i - 1 ] +
                  ( 1 / rebelGroups[ strong.members[ i ] ].nmrOfRebels );
              }

              i = len;
              while ( i > 0 ) {
                t = rand.uniform( 0, 1 );
                j = -1;
                do {
                  j += 1;
                  v = s[ j ] / s[ s.length - 1 ];
                } while ( v < t );

                if ( nmrOfTransfers[ j ] < rebelGroups[
                  strong.members[ j ] ].extortedEnterprises.length ) {
                  nmrOfTransfers[ j ] += 1;
                  i -= 1;
                }
              }
            }

            // Logging
            sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
              "LOSER REBEL GROUPS" );

            // Select random Enterprises from strong Rebel Group
            enterprises = [];
            for ( i = 0; i < strong.members.length; i += 1 ) {
              rebelGroup = rebelGroups[ strong.members[ i ] ];

              // Logging
              sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
                "Rebel Group " + rebelGroup.id +
                " Nmr Enterprises BEFORE " +
                rebelGroup.extortedEnterprises.length );

              for ( j = 0; j < nmrOfTransfers[ i ]; j += 1 ) {
                index = rand.uniformInt( 0,
                  rebelGroup.extortedEnterprises.length - 1 );
                enterprises.push( rebelGroup.extortedEnterprises[ index ] );
                rebelGroup.extortedEnterprises.splice( index, 1 );
              }

              // Logging
              sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
                "Rebel Group " + rebelGroup.id +
                " Nmr Enterprises AFTER " +
                rebelGroup.extortedEnterprises.length );
            }

            // Proportion to transfer to each weak Rebel Group
            totalTransfers = 0;
            nmrOfTransfers = Array( weak.members.length ).fill( 0 );
            for ( i = 0; i < weak.members.length; i += 1 ) {
              nmrOfRebels = rebelGroups[ weak.members[ i ] ].nmrOfRebels;
              nmrOfTransfers[ i ] = Math.min( Math.ceil( enterprises.length *
                ( nmrOfRebels / weak.nmrOfRebels ) ), len - totalTransfers );
              totalTransfers += nmrOfTransfers[ i ];
            }

            // Logging
            sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
              "WINNER REBEL GROUPS" );

            // Transfer Enterprises to weak Rebel Groups
            rand.shuffleArray( enterprises );
            for ( i = 0; i < weak.members.length; i += 1 ) {
              rebelGroup = rebelGroups[ weak.members[ i ] ];

              // Logging
              sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
                "Rebel Group " + rebelGroup.id +
                " Nmr Enterprises BEFORE " +
                rebelGroup.extortedEnterprises.length );

              for ( j = 0; j < nmrOfTransfers[ i ]; j += 1 ) {
                enterprise = enterprises.splice( 0, 1 )[ 0 ];
                enterprise.rebelGroup = rebelGroup;
                enterprise.nmrOfLootings = 0;
                rebelGroup.extortedEnterprises.push( enterprise );
              }

              // Logging
              sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
                "Rebel Group " + rebelGroup.id +
                " Nmr Enterprises AFTER " +
                rebelGroup.extortedEnterprises.length );
            }
          } else {
            // Logging
            sim.model.f.logObj( [ this.attacker.id, this.opponent.id ],
              "No Winner" );
          }
        }

        // Fight decreases RG size proportional to opposite RG's strength
        totalDeaths = 0;
        strong.members.forEach( function ( objId ) {
          rebelGroup = rebelGroups[ objId ];
          nmrOfDeaths = Math.ceil( rebelGroup.nmrOfRebels * weakProb );
          totalDeaths += nmrOfDeaths;
          rebelGroup.nmrOfRebels -= nmrOfDeaths;
        } );

        weak.members.forEach( function ( objId ) {
          rebelGroup = rebelGroups[ objId ];
          nmrOfDeaths = Math.ceil( rebelGroup.nmrOfRebels * weakProb );
          totalDeaths += nmrOfDeaths;
          rebelGroup.nmrOfRebels -= nmrOfDeaths;
        } );

        sim.stat.nmrOfFights += 1;
        sim.stat.sumOfFights += 1;
        sim.stat.nmrOfDeaths += totalDeaths;
      }

      return followupEvents;
    }
  }
} );
Fight.priority = 2;