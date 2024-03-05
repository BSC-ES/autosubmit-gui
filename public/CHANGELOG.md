## Changelog

### Pre-release v4.0.0-beta.4 - Release date: TBD

### Pre-release v4.0.0-beta.3 - Release date: 2024-03-05

* **Major change**: New graphical upgrade. Everything changed.
* Multiple dependencies changed:
    * Bootstrap removed
    * Redux toolkit added
    * Tailwind CSS added (with headlessUI and RadixUI)
    * Sass added
* Experimental dark mode
* Support to new `autosubmit_api>=4.0.0b3`


### Pre-release v3.8.0-beta.1 (v4.0.0-beta.2) - Release date: 2023-11-23

* Supports `autosubmit_api>=4.0.0b2`
* Configuration updated to support dotenv files.
* Experiment configuration tab is enabled and supported for Autosubmit 4.0 experiments
* Fixed redirections on not Unauthorized responses from the API

### Release v3.7.0 - Release date: 2023-06-09
* UI/UX improvements
    * Improved compatibility for Autosubmit 4.0 and above experiments
    * Improved robustness and maintainability of the API
    * For Autosubmit 4.0 configuration tab will be disabled until a full redesign is carried out.
* Bug fixes
    * Graph and Treeview fixes on issues detected after migration to Python 3.7