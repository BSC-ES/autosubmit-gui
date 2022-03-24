This folder contains the state management of the `ReactJS` app.

These folders contain state management logic:

- **alert**: State management for alerts in the app. It has limited usage.
- **experiment**: State management for the experiment data. It is the main state in the app. For example, the initial page of the app uses this state to show the list of experiments.
- **graph**: State management for the Graph representation data.
- **tree**: State management for the Tree representation data.
- **lighter**: State management for the Quick View (or presentation) of the experiment.
- **statistics**: State management for the Statitics module.

Then, we also have:

- **data**: It should contain the data used in the `NOAPI = true` mode. If you don't need to use that mode, make sure it is not full of data that would make your package too large.

