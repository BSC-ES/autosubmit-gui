import React, { useEffect, useState } from 'react';
import showdown from 'showdown'
import useASTitle from '../hooks/useASTitle';
import useBreadcrumb from '../hooks/useBreadcrumb';
import { PUBLIC_URL } from '../consts';

const About = () => {
    useASTitle("About")
    useBreadcrumb([
        {
            name: "About"
        }
    ])
    const [markdown, setMarkdown] = useState("")
    console.log(process.env.PUBLIC_URL)

    useEffect(() => {
        fetch(`${PUBLIC_URL}/CHANGELOG.md`)
            .then((r) => r.text())
            .then(text => {
                const converter = new showdown.Converter()
                setMarkdown(converter.makeHtml(text))
            })
    })

    return (
        <div className='border rounded-2xl px-8 pt-6 pb-8'>
            <div className="markdown-container"
                dangerouslySetInnerHTML={{ __html: markdown }} />
        </div>
    )
}

export default About;