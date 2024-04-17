.. _graphRepresentation:

Graph Representation
====================

The Graph Representation of the experiment offers a dependency oriented view.

.. .. figure:: fig/fig_graph_2.jpg
..    :name: experiment_graph
..    :width: 100%
..    :align: center
..    :alt: Experiment Graph 1

..    Experiment Graph Representation

This view offers a graph representation of the experiments where a node represents a job and an edge represents a directed dependency relationship between nodes. To open it you must click on the button ``Classic``, which is the basic representation that uses either ``GraphViz`` or an heuristic approach depending on experiment complexity; we explain the other options later. 

Once the graph representation is loaded, it will focus on a relevant node according to some established rules. The color of each node represents the status of the job it represents: you can see a color guide at the bottom of the page in the form of buttons. If you click in any of those buttons, the graph will focus on the last node with that status, except in the case of ``WAITING`` where the graph will focus on the first one. You can navigate the graph in this way, but there are other navigation buttons at the left and right corners of the graph canvas. You can also use your mouse or trackpad to navigate the graph, zoom in or zoom out. Below each node you can see the ``job name`` of the job it represents. 

.. important:: For some experiments you will get a well distributed and generally good looking graph representation, for others you get a more straightforward representation. It depends on the size and dependency complexity of your experiments, not all experiments can be modeled as a good looking graph in reasonable time.

When you click on a node, you can see on the right panel (**Selection Panel**) the following information:

- *Start*: Starting date.
- *End*: Ending date.
- *Section*: Also known as job type.
- *Member*
- *Chunk*
- *Platform*: Remote platform.
- *Id*: Id in the remote platform.
- *Processors*: Number of processors required by the job.
- *Wallclock*: Time requested by the job.
- *Queue*: Time spent in queue, in minutes.
- *Run*: Time spent running, in minutes.
- *Status*: Job status.
- *Out*: Button that opens a list of jobs that depend on the one selected.
- *In*: Button that opens a list of jobs on which the selected job depends.
- *out path*: Path to the .out log file.
- *err path*: Path to the .err log file.
- *Submit*: Submit time of the job (If applicable).
- *Start*: Start time of the job (If applicable).
- *Finish*: Finish time of the job (If applicable).

.. important:: Next to the **out** and **err** paths, you see the a ``Copy out/err`` button that copies the path to your clipboard. Then you see an ``eye symbol`` button, that when clicked will show that last 150 lines of the **out/err** file.

Selection
---------

When you click on a node in the tree view, a ``Change Status`` button will appear in the top bar, if you click, you will be presented with the option to generate a change status command that can be run on autosubmit, or to generate a format that can be used to change the status of the job while the experiment is running.

You can select many nodes at the same time by maintaining ``CTRL`` pressed and clicking on the nodes, then the generated command will include all these jobs.

Wrappers Representation
-----------------------

Wrappers are an important feature of Autosubmit, and as such, it should be possible to visualize them in the graph representation.

.. .. figure:: fig/fig_graph_3.jpg
..    :name: experiment_graph_wr
..    :width: 100%
..    :align: center
..    :alt: Experiment Graph Wrapper

..    Wrapper Graph Representation


Wrappers are represented by nodes that have dashed border, hexagon or square shape (no difference between them), and that share green background edges. On the right side of the graph you can find the **Wrappers Tab** and it will display a list of the existing wrappers as buttons. If you click on any of these buttons, the nodes that belong to that wrapper will be highlighted.

Monitoring
----------

If the experiment is ``RUNNING`` you will see at the top right corner the button ``Start Job Monitor``. When you click on it, a live **Job Monitor** will be initialized and the status of the jobs and wrappers will be queried every minute, any change will be updated in the graph. Also, if the **Job Monitor** is running, the detected changes will be listed in a panel **Monitor Panel** below the **Selection Panel**. You can stop this process by clicking on the button **Stop Job Monitor**.

.. important:: While this is a good option to monitor the progress of your experiment, you can also use the :ref:`log`.

Job Search
----------

.. .. figure:: fig/fig_graph_4.jpg
..    :name: experiment_graph_search
..    :width: 100%
..    :align: center
..    :alt: Job Search

..    Job Search in Graph

On top of the graph you will see an input text box following by the button ``Search by Job Name``. Insert into that box the string that you want to find and the engine will build an internal list of those jobs whose name coincides with that string. For example ``_LOCAL_`` will show only jobs whose title contain the that string. Buttons ``Previous`` and ``Next`` will appear and next to them the number of jobs that coincide with your search, you can use these buttons to traverse the graph highlighting the nodes included in the resulting internal list.

Grouped by Date Member
----------------------

By clicking on the button ``Grouped by D-M`` you get a graph representation where the nodes are clustered by date and member. For example, if your experiment has only one starting date and one member, then you will have only one cluster in this view. These clusters are represented by rectangular boxes whose color gives a general idea of the status of the jobs inside it. 

.. important:: You can double click on any cluster to "open" it, meaning that the nodes that belong to that cluster will be freed and positioned individually.

Grouped by Status
-----------------

By clicking on the button ``Grouped by Status`` you get a graph representation where the nodes are clustered by status into 3 clusters: ``WAITING``, ``COMPLETED``, and ``SUSPENDED``. Same rules mentioned for **Grouped by Date Member** apply.

Laplacian
---------

By clicking on the button ``Laplacian`` you get a graph representation where the ``(x,y)`` coordinates of each node are calculated based on the second and third smallest eigenvector of the Graph Laplacian. All functionality is supported.


