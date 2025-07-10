import React, { useEffect, useState } from 'react';
import showdown from 'showdown'
import useASTitle from '../hooks/useASTitle';
import useBreadcrumb from '../hooks/useBreadcrumb';
import packageJson from "../../package.json";
import { Disclosure } from '@headlessui/react'
import { cn } from '../services/utils'


const FAQ = [
  {
    key: 1,
    question: (<span>Where does the information in the <strong>Tree/Graph/Quick</strong> View come from?</span>),
    answer: (<>
      <p>The information directly related to the status of the jobs comes from the <em>pkl</em> file that Autosubmit generates and constantly updates when your experiment is running. This file stores key information from your jobs that allows us to identify them and retrieve their information.</p>
      <p className='mt-2'>The <em>queuing</em> and <em>running</em> times come from the files that Autosubmit generates to store the submit, start, and finish times with the status of your jobs. These files usually end with the string <em>*_TOTAL_STATS </em> where <strong>*</strong> is replaced by the job's name. This file can contain the registers for many runs of the same job. Moreover, the latest version of Autosubmit implements a job historical database that improves the previously described functionality and extends its data retrieval capabilities. If this information is available, it will be prioritized over the former source.</p>
    </>)
  },
  {
    key: 2,
    question: (<span>Where can I report an issue?</span>),
    answer: (<>
      <p>If you find that something is broken or you suspect that it is not working correctly, you can open an issue at <a href="https://earth.bsc.es/gitlab/es/autosubmit/-/issues" target="_blank" className='text-primary-600 dark:text-primary-400' rel="noreferrer">Autosubmit GUI Issues</a>.</p>
    </>)
  },
  {
    key: 3,
    question: (<span>What does it mean for a job's <strong>STATUS</strong> to be shown as <em>SUSPICIOUS</em>?</span>),
    answer: (<>
      <p>The <em>pkl</em> file of your experiment stores the current status of its jobs. The <em>*_TOTAL_STATS</em> files that Autosubmit generates also store the status of the corresponding job in the experiment. Whenever the values on these sources differ, the GUI assumes that something is not working right and it will show the <em>SUSPICIOUS</em> status text next to the job's name as a warning. Sometimes there is a little bit of delay between Autosubmit updating the <em>pkl</em> file and updating or creating the <em>*_TOTAL_STATS</em> file, in this case the <em>SUSPICIOUS</em> status should be replaced by the right status after some minutes if you <span className="badge bg-success text-white">refresh (F5)</span> the Tree/Graph/Quick view of your experiment, or if the <span className="badge bg-success text-white">START MONITOR</span> tool is active. However, if it does not disappear, it could mean that truly something wrong is happening with your experiment.</p>

    </>)
  },
  {
    key: 4,
    question: (<span>I see the error message: <span className="text-red-700 dark:text-red-300">"Autosubmit API couldn't open pkl file"</span>. What can I do?</span>),
    answer: (<>
      <p>The <em>pkl</em> file stores the most important data of the list of jobs in your experiment. Its name has the format <em>job_list_%expid%.pkl</em> and is located in the <em>/pkl/</em> folder of your experiment. An exception or interruption of the normal execution of Autosubmit can result in a blank pkl file, see <a href='https://autosubmit.readthedocs.io/en/master/userguide/modifying%20workflow/index.html?highlight=recovery' target='_blank' rel='noreferrer'>autosubmit recovery</a> for instructions to recover your experiment information. However, it could happen that there already exists a valid version of your pkl file in the corresponding folder but it is named as a backup file that was not properly restored. If that is the case, run the command <code>autosubmit pklfix expid</code> on the latest version of Autosubmit, where <em>expid</em> is replaced by your experiment identifier.</p>

    </>)
  }

]

const About = () => {
  useASTitle("About")
  useBreadcrumb([
    {
      name: "About"
    }
  ])
  const [markdown, setMarkdown] = useState("")

  useEffect(() => {
    fetch(`CHANGELOG.md`)
      .then((r) => r.text())
      .then(text => {
        const converter = new showdown.Converter()
        setMarkdown(converter.makeHtml(text))
      })
  })

  return (
    <div className='flex flex-col gap-4'>

      <div className='border rounded-2xl px-8 pt-6 pb-8'>
        <div className='markdown-container'>
          <h2>About</h2>
          <p>
            The Autosubmit GUI is a modern web application that allows you to easily monitor the experiments inside your Autosubmit environment.
          </p>
          <p>If you find a bug or want to request some important feature, please open an issue at <a
            href="https://github.com/BSC-ES/autosubmit-gui/issues" target='_blank' className='text-primary-600 dark:text-primary-400' rel="noreferrer"
          >Autosubmit GUI Issues page</a>.</p>
        </div>
        <div className='w-full text-right text-black/50 dark:text-white/50'>— GUI Version: {packageJson.version}</div>
      </div>

      <div className='border rounded-2xl px-8 pt-6 pb-8'>
        <div className='markdown-container'>
          <h2>Frequently Asked Questions (FAQ)</h2>
          <div className='flex flex-col gap-4 mt-4'>
            {
              FAQ.map(item => {
                return (
                  <Disclosure key={item.key}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex items-center py-2 px-4 w-full rounded-lg text-left bg-primary-200 text-primary-900 dark:bg-primary-800 dark:text-primary-100">
                          {item.question}
                          <i className={cn("ms-auto fa-solid", open ? "fa-angle-down" : "fa-angle-up")}></i>
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-6 pb-4 ">
                          {item.answer}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                )
              })
            }
          </div>
        </div>
      </div>

      <div className='border rounded-2xl px-8 pt-6 pb-8'>
        <div className="markdown-container"
          dangerouslySetInnerHTML={{ __html: markdown }} />
      </div>

    </div>
  )
}

export default About;
