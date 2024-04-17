.. _home:

Main Page
========================

Inside the Barcelona Supercomputing Internal Network you can find the latest version of Autosubmit GUI deployed for BSC users. It can be accessed by following the url http://bscesweb04.bsc.es/autosubmitapp/ or https://earth.bsc.es/autosubmitapp/. This is a graphic user interface that allows you to easily monitor your experiments and those of your colleagues. This Web App introduces many useful features for experiment monitoring, and we are continuously improving it.

.. note:: The Web App can also be accessed through the VPN Client provided by BSC.

When you enter the site, you will be presented with the following page: 

.. .. figure:: fig/fig1_gui.png
..    :name: first_page
..    :width: 100%
..    :align: center
..    :alt: autosubmit guide

..    Welcome page

Here you can search for any ongoing or past experiment by typing some text in the Search input box and pressing **Search**: the search engine will look for coincidences between your input string and any of the description, owner or name of the experiment fields. The results will be shown below ordered by status, experiments ``RUNNING`` will be shown in the first rows. You can also click on the ``Running`` button, and all the experiments that are currently running will be listed. The results will look like:

.. .. figure:: fig/fig2_gui.png
..    :name: first_page_search
..    :width: 100%
..    :align: center
..    :alt: result search

..    Search Result

If you click on ``Show Detailed Data``, summary data for each experiment (result) will be loaded. These are data details from the experiment run, useful to see its status at a glance. Progress bars and status will use different colors to highlight the important information.

.. .. figure:: fig/fig3_gui.png
..    :name: first_page_search_plus
..    :width: 100%
..    :align: center
..    :alt: result search plus

..    Search Result plus Detailed Data

For each experiment, you see the following data:

.. .. figure:: fig/fig4_gui.jpg
..    :name: first_page_search_plus_description
..    :width: 100%
..    :align: center
..    :alt: result search plus description

..    Description of Detailed Data

1. *Experiment Name*
2. *Progress Bar*: Shows completed jobs / total jobs. It turns red when there are **failed** jobs in the experiment, but **Show Detailed Data** should have been requested.
3. *Experiment Status*: *RUNNING* or *NOT RUNNING*.
4. *Owner*
5. *Experiment Description*
6. *Refresh button*: It will say *Summary* when the detailed data has not been requested. If it says *Summary* and you click on it, it will load detailed data for that experiment, otherwise it will refresh the existing detailed data.
7. *More button*: Opens the **Experiment Page**.
8. *Average Queue Time* for all jobs.
9. *Average Run Time* for all jobs.
10. *Number of Running Jobs*
11. *Number of Queuing Jobs*
12. *Number of Submitted Jobs*
13. *Number of Suspended Jobs*
14. *Number of Failed Jobs*: If there are Failed jobs, a list of the names of those jobs will be displayed.

.. .. figure:: fig/fig5_gui.jpg
..    :name: first_page_search_plus_description_sim
..    :width: 100%
..    :align: center
..    :alt: result search plus description + sim

..    Average Times Feature

In experiments that include ``SIM`` jobs, you will also see the average queuing and running time for these jobs. In the latest version the time format has been updated to ``HH:mm:ss``. The text for the ``SIM`` average follows the format ``avg. queue HH:mm:ss (M) | run HH:mm:ss (N)`` where ``M`` is the number of jobs considered for the ``avg. queue`` calculation and ``N`` is the number of jobs considered for ``run`` calculation. 

After clicking on the **MORE** button, you will be presented with the **Experiment Page**, which is the main view that Autosubmit provides. These are its main components:


.. important:: To improve response times, Autosubmit GUI will try to store the dependency structure of your experiment in a database filed called ``structure_expid.db`` where ``expid`` is the name of your experiment. This file will be located in ``/esarchive/autosubmit/expid/pkl/``.