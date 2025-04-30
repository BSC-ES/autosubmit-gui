Job Panel
-----------

The Experiment ``Job Panel`` have the following information:

- *Start*: Starting date.
- *End*: Ending date.
- *Section*: Also known as job type.
- *Member*
- *Chunk*
- *Platform*: Remote platform.
- *Remote Id*: Id in the remote platform.
- *QoS*
- *Processors*: Number of processors required by the job.
- *Wallclock*: Time requested by the job.
- *Queue*: Time spent in queue, in minutes.
- *Run*: Time spent running, in minutes.
- *Status*: Job status.
- *Children*: Button that opens a list of jobs that depend on the one selected.
- *Parents*: Button that opens a list of jobs on which the selected job depends.
- *out path*: Path to the .out log file.
- *err path*: Path to the .err log file.
- *Submit*: Submit time of the job (If applicable).
- *Start*: Start time of the job (If applicable).
- *Finish*: Finish time of the job (If applicable).
- *SYPD*
- *PSYPD*
- *Wrapper*

.. note:: Next to the **out** and **err** paths, you see the a ``Copy out/err`` button that copies the path to your clipboard. Then you see a ``>_`` button, that when clicked will show that last 150 lines of the **out/err** file.

Additionally, you have an option to see the ``Job History`` and ``Change Status``, if applicable.

If you click ``Change Status``, you will be presented with the option to generate a change status command that can be run on autosubmit, or to generate the content of a change status file that can be used to change the status of the job.
