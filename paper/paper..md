---
title: "A React based visual interface to monitor experiments in a High Performance Computing environment"
tags:
  - Python
  - High Performance Computing
  - Workflow Manager
authors:
  - name: Wilmer V. Uruchi Ticona^[Custom footnotes for e.g. denoting who the corresponding author is can be included like this.]
    ## orcid: 0000-0003-0872-7098
    affiliation: 1 ##"1, 2" # (Multiple affiliations must be quoted)
  - name: Miguel Castrillo
    affiliation: 1
  - name: Daniel Beltrán
    affiliation: 1
affiliations:
  - name: Barcelona Supercomputing Center # Lyman Spitzer, Jr. Fellow, Princeton University
    index: 1
  - name: Institution Name
    index: 2
  - name: Independent Researcher
    index: 3
date: 26 November 2020
# bibliography: paper.bib

# Optional fields if submitting to a AAS journal too, see this blog post:
# https://blog.joss.theoj.org/2018/12/a-new-collaboration-with-aas-publishing
# aas-doi: 10.3847/xxxxx <- update this with the DOI from AAS once you know it.
# aas-journal: Astrophysical Journal <- The name of the AAS journal.
---

# Summary

A project can involve the execution of many tasks that have dependencies between them.
This usually happens in the High Performance Computing environment, where scientist are interested in performing sequence of tasks
that have linear dependency. These tasks usually belong to a group or project that encompasses these tasks.
Since these tasks can have dependencies between them, a group of tasks can be modeled as an acyclic directed graph.
A visual representation of the group of tasks and their dependencies is needed to properly monitor their status and also to visualize
their meta-data. Autosubmit Graphical User Interface offers a way to visualize these projects by rendering them as a Tree View, or a Graph.

# Statement of need

`Autosubmit GUI` is a React based web application that shows data in an intuitive way. A web application enables us to deploy this service easily and with minimum requirements for our users. `Autosubmit GUI` was designed and developed with efficiency in mind.

`Autosubmit` (reference) is a workflow manager for experiments run by scientists in the Earth Science Deparment of the Barcelona Supercomputing Center. It is a terminal program that launches jobs on a variety of High Performance Computers to which our users have access, it also retrieves important information that users need in order to properly track the progress of their work. Monitoring these experiments has been a long standing issue that has been tried to be addressed in several. At some point it was decided that a Graphical Interface was needed in order to provide an intuitive access to users that also could be not very familiar with the terminal commands. It was decided take a web based approach, and then ReactJS was chosen as the main tool.

`ReactJS` enables us to access a wide array of web tools and more importantly a design phisolophy that we thought was approriate for this problem. The component based development of React applications allows us the provide a easy to modify interface with different sections that can be updated in real time and independently of each other. Also, there are several appropriate and more importantly free libraries that we can use to show the information in an easy to understand way. `FancyTree` is the library that we used as our main representation tool, because it provides a linear an easy to navigate presentation. `Vis.js` with its graph component is the other main library we use to represent data, this library provides a rich API that can be used to personalize its inner working, this fact was extremely benefitial for our purposes.

`Autosubmit GUI` consumes information from `Autosubmit API`, and ad-hoc API designed to extract information from the results of `Autosubmit`. The list of calls and messages can be found in our repository documentation. We believe that, although API specific, the methods of `Autosubmit GUI` can be ported and adapted to a similar API.

# Main features

<!-- Single dollars ($) are required for inline mathematics e.g. $f(x) = e^{\pi/x}$

Double dollars make self-standing equations:

$$
\Theta(x) = \left\{\begin{array}{l}
0\textrm{ if } x < 0\cr
1\textrm{ else}
\end{array}\right.
$$

You can also use plain \LaTeX for equations
\begin{equation}\label{eq:fourier}
\hat f(\omega) = \int\_{-\infty}^{\infty} f(x) e^{i\omega x} dx
\end{equation}
and refer to \autoref{eq:fourier} from text. -->

# Citations

<!-- Work in progress -->

Citations to entries in paper.bib should be in
[rMarkdown](http://rmarkdown.rstudio.com/authoring_bibliographies_and_citations.html)
format.

If you want to cite a software repository URL (e.g. something on GitHub without a preferred
citation) then you can do it with the example BibTeX entry below for @fidgit.

For a quick reference, the following citation commands can be used:

- `@author:2001` -> "Author et al. (2001)"
- `[@author:2001]` -> "(Author et al., 2001)"
- `[@author1:2001; @author2:2001]` -> "(Author1 et al., 2001; Author2 et al., 2002)"

# Figures

<!-- Work in progress -->

Figures can be included like this:
![Caption for example figure.\label{fig:example}](figure.png)
and referenced from text using \autoref{fig:example}.

# Acknowledgements

We acknowledge contributions from Francisco Doblas-Reyes, Kim Serradell and all our Earth Science users.

# References
