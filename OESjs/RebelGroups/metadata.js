/*******************************************************************************
 * Rebel Groups Protection Racket simulation model metadata information
 *
 * @copyright Copyright 2018-2019 Brandenburg University of Technology, Germany
 * @license The MIT License (MIT)
 * @author Frances Duffy
 * @author Kamil Klosek
 * @author Luis Gustavo Nardin
 * @author Gerd Wagner
 ******************************************************************************/
var sim = sim || {};
sim.model = sim.model || {};
sim.scenario = sim.scenario || {};
sim.config = sim.config || {};

var oes = oes || {};
oes.ui = oes.ui || {};
oes.ui.explanation = {};

/*******************************************************************************
 * Simulation Model
 ******************************************************************************/
sim.model.name = "RebelGroups-1";
sim.model.title = "Rebel Group Protection Rackets";
sim.model.systemNarrative =
    "<p>How do rebel groups control territory and engage with the local economy during civil war? Charles Tilly's seminal <i>War and State Making as Organized Crime</i> (1985) posits that the process of waging war and providing governance resembles that of a protection racket, in which aspiring governing groups will extort local populations in order to gain power, and civilians or businesses will pay in order to ensure their own protection. Civil war research increasingly probes the mechanisms that fuel local disputes and the origination of violence. This analysis provides insights for understanding the causes and byproducts of rebel competition in present-day conflicts, such as the cases of South Sudan, Afghanistan, and Somalia.</p>";
sim.model.shortDescription =
    "<p>The model's purpose is to help exploring the economic relationship of rebel groups with local populations, using extortion racket interactions to explain the dynamics of rebel fighting, their impact on the economy, and the importance of their economic base of support. The model defines two object types: <i>RebelGroup</i> and <i>Enterprise</i> and the event types <i>Income</i>, <i>Demand</i>, <i>Extort</i>, <i>Loot</i>, <i>Expand</i>, <i>Fight</i>, <i>AllocateResource</i>, <i>Report</i>, and <i>Flee</i>.</p><p>A <em>rebel group</em> competes for power in a system of anarchy, in which there is effectively no government control. An <em>enterprise</em> is a local civilian-level actor that conducts business in this environment, whose objective is to make a profit. In this system, a rebel group may choose to extort money from enterprises in order to support its fighting efforts. It can extract payments from an enterprise, which fears for its safety if it does not pay. This adds some amount of money to the rebel group’s resources, and they can return to extort the same enterprise again. The rebel group can also choose to loot the enterprise instead. This results in gaining all of the enterprise wealth, but prompts the individual enterprise to flee, or leave the model. This reduces the available pool of enterprises available to the rebel groups for extortion. Following these interactions, a rebel group can choose to AllocateResources, or pay its rebel fighters. Depending on the value of its available resources, it can add more rebels or expel some of those which it already has, changing its size. It can also choose to expand over new territory, or effectively increase its number of potential extorting Enterprises. As a response to these dynamics, an Enterprise can choose to Report expansion to another RebelGroup, which results in fighting between the two groups. This system shows how, faced with economic choices, RebelGroups and Enterprises make decisions in war that impact conflict and violence outcomes.</p>";
sim.model.source = "<a href='https://link.springer.com/chapter/10.1007/978-3-030-29333-8_11' target='_blank'>Rebel Group Protection Rackets: " +
  "Simulating the Effects of Economic Support on Civil War</a >. In E. Deutschmann, J. Lorenz, L.G. Nardin, D. Natalini and A. Wilhelm (Eds.), "+
  "<i>Computational Conflict Research</i>, 2020.  Springer, Cham, Computational Social Sciences, pp. 225–251.";
sim.model.license = "CC BY-NC";
sim.model.creator =
  "Frances Duffy, Kamil Klosek, Luis Gustavo Nardin, Gerd Wagner";
sim.model.created = "2018-07-26";
sim.model.modified = "2019-05-08";