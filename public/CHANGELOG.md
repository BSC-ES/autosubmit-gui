## Changelog

### Release v4.0.1 - Release date: 2025-06-10

* Supported Autosubmit API version: [4.1.1](https://pypi.org/project/autosubmit-api/4.1.1/)

### Pre-release v4.1.0-beta.1 - Release date: 2025-05-21

* **Compatibility with Autosubmit API version >= [4.1.0b1](https://pypi.org/project/autosubmit-api/4.1.0b1/)**
* Added OpenID Connect support
* Added Simulated Years and Sustainability metrics sections in Performance view
* Added `workflow_commit` field in experiment and job details
* Added log recovery logs tab in the Run log view 
* Added user-defined metrics page
* Minor visual fixes

### Pre-release v4.0.1-beta.4 - Release date: 2025-02-24

* Updated upper bar in experiment pages to show basic information in all sub-sections
* Then statistics page now shows a list of possible job sections to query
* Login will redirect you to the last page visited before logout
* Configuration page job sections can be filtered supporting wildcards `*`
* Configuration page saves the search state on the URL params making it shareable
* Multiple minor visual improvements

### Pre-release v4.0.1-beta.3 - Release date: 2024-12-10

* **Compatibility with Autosubmit API version >= [4.0.1b5](https://pypi.org/project/autosubmit-api/4.0.1b5/)**
* Change status modal now only allows change to `WAITING`, `COMPLETED`, `SUSPENDED`, and `FAILED`
* Add HPC filter to the home page
* Search by owner, autosubmit version, and HPC supports wildcards `*` and negation `!`
* Several dependencies updated

### Release v4.0.1 - Release date: 2025-05-19

* Supported Autosubmit API version: [4.0.1](https://pypi.org/project/autosubmit-api/4.0.1/)

### Pre-release v4.0.1-beta.2 - Release date: 2024-10-01

* **Compatibility with Autosubmit API version >= [4.0.1b3](https://pypi.org/project/autosubmit-api/4.0.1b3/)**
* Improved the experiment configuration page

### Pre-release v4.0.1-beta.1 - Release date: 2024-07-18

* **Compatibility with Autosubmit API version >= [4.0.1b2](https://pypi.org/project/autosubmit-api/4.0.1b1/)**
* Added a subsection to show not considered jobs (outliers) in the Experiment Performance View
* Added colors to the select status in the change status modal

### Release v4.0.0 - Release date: 2024-07-15

* Supported Autosubmit API version: [4.0.0](https://pypi.org/project/autosubmit-api/4.0.0/)

### Pre-release v4.0.0-beta.5 - Release date: 2024-07-15

* Fixed error messages in Login page
* Minor improvements in experiment performance page

### Pre-release v4.0.0-beta.4 - Release date: 2024-05-02

* Updated About page
* Fixed mandatory login redirect on unauthenticated case
* Added a button to periodically refresh the home page
* Added the "Job Selection" button to generate change status commands 
* Replaced graph visualization library to Cytoscape.js
* Add selection panel in graph view
* Add select by status option in graph view
* Improved wrapper visualization
* Fixed minor bugs
* Made multiple minor visual improvements

### Pre-release v4.0.0-beta.3 - Release date: 2024-03-05

* **Major change**: New graphical upgrade. Everything changed.
* Multiple dependencies changed:
    * Bootstrap removed
    * Redux toolkit added
    * Tailwind CSS added (with headlessUI and RadixUI)
    * Sass added
* Added experimental dark mode
* Support to new `autosubmit_api>=4.0.0b3`