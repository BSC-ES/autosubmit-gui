These are the main components of the application. Here is a list of what you're expected to find in each subfolder:

- **context**: Contains the `state` (in the `ReactJS` sense) management files of the app.
- **experiment**: `ReactJS` components that are used in the `main views`.
- **layout**: `ReactJS` components that are directly related to the layout (appearance) of the app.
- **pages**: The `main views` of the app. These are directly related to routes in the app.
- **plots**: `ReactJS` components that are consumed by the statistics module to show information plots. A better place for this folder might be inside the **statistics** folder, but at some point we might reuse these plots in other modules.
- **statistics**: `ReactJS` components directly related to the statistics module. In a separate folder because it is expected that the statistics module continues to grow and require its own set of components.
