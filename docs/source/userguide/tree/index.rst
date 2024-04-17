.. _treeRepresentation:

Tree Representation
===================

The Tree Representation offers a structured view of the experiment.

.. .. figure:: fig/fig_tree_2.jpg
..    :name: experiment_tree
..    :width: 100%
..    :align: center
..    :alt: Experiment Tree 1

..    Experiment Tree Representation

The view is organized in groups by ``date``, and ``date-member``. Each group has a folder icon, and next to the icon you can find the progress of the group as ``completed / total`` jobs (when all the jobs in a group have been completed, a check symbol will appear); then, an indicator of how many jobs inside that group are **RUNNING**, **QUEUING**, or have **FAILED**. Furthermore, if wrappers exist in the experiment, these will be enclosed in the  ``wrappers`` folder sorted by running time. independent groups will be added for each wrapper that will contain the list of jobs included in the corresponding wrapper. This implies that a job can be repeated: once inside its ``date-member`` group and once in its wrapper group.

Inside each group you will find the list of jobs that belong to that group. The jobs are shown following this format: *job name* + # *job status* + ( + *queuing time* + ) + *running time*. Jobs that belong to a wrapper have also a badge with the code of the wrapper.

The ``date-member`` folders will be displayed collapsed if all jobs inside a given folder have status COMPLETED, SUSPENDED or WAITING, the user also can expand and collapse all the items of the tree by clicking the corresponding buttons located in the toolbar above.

When you click on a Job, you can see on the right panel (**Selection Panel**) the following information:

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

When you click on a job in the tree view, a ``Change Status`` button will appear in the top bar, if you click, you will be presented with the option to generate a change status command that can be run on autosubmit, or to generate a format that can be used to change the status of the job while the experiment is running.

You can select many jobs at the same time by maintaining ``CTRL`` pressed and clicking on the jobs, then the generated command will include all these jobs.



Monitoring
----------

If the experiment status is **RUNNING**, you will see a button called **Refresh** at the top right corner. This button will update the information of the jobs in the tree if necessary. Next to this button, you will see the button **Start Job Monitor**. When you click on it, a live **Job Monitor** will be initialized and the status of the jobs and wrappers will be queried every minute, any change will be updated in the **Tree View**. Also, if the **Job Monitor** is running, the detected changes will be listed in a panel **Monitor Panel** below the **Selection Panel**. You can stop this process by clicking on the button **Stop Job Monitor**.

The button **Clear Tree View** will clear the Tree Representation. It is also a valid way to refresh the Tree View.

Filter
------

At the top left you can find the **Filter text** input box. Insert any string and the list will show only those jobs whose description coincides with that string. For example ``#COMPLETED`` will show only completed jobs, ``Wrapped`` will show only those jobs that belong to a wrapper, ``_fc0_`` will show only those jobs that belong to the fc0 member. Press **Clear** to reset the filter. On the right side of this bar, you will see the total number of jobs, and the chunk unit used in the experiment.

Advanced Filter
---------------

It is possible to use the key char ``*`` to separate keywords in the name of the job, in order. For example:

- ``1850*fc0*_1_``: List all the jobs that have the string ``1850`` and then at least 1 occurrence of the string ``fc0`` and then at least 1 occurrence of the string ``_1_``. This will effectively list all the jobs for the DATE that starts with ``1850`` for the member ``fc0`` and the chunk ``_1_``.
- ``000*_5``: List all the jobs that have the string ``000`` followed by at least one occurrence of the string ``_5``. This will effectively list all the jobs that have member ``000`` and chunk number that starts with the digit ``5``.
- ``000*_5*PREPROCVAR``: It will also add the filter for jobs of type ``PREPROCVAR``.

As you might infer, the logic is fairly straightforward: Start your string with the word or part of the word you are looking for, then add ``*`` and the word or part of the word that follows, and so on. The algorithm will split your string by ``*`` and then search for each part in order, once it finds the part in the title of the job, it takes a substring of the job title to not repeat the next search in the same string, it continues looking for the next part in the new reduced string, and so on.

You can extend this functionality considering that date, member, section, chunk names start with the symbol ``_`` and finish with the same symbol.

.. important:: This view is designed to show a structured view of your experiment, if you want a more dependency oriented view that shows better the execution sequence of your jobs, you can refer to :ref:`graphRepresentation`.



