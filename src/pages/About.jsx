import React, { useEffect, useState } from 'react';
import showdown from 'showdown'
import useASTitle from '../hooks/useASTitle';
import useBreadcrumb from '../hooks/useBreadcrumb';

const About = () => {
    useASTitle("About")
    useBreadcrumb([
        {
            name: "About"
        }
    ])
    const [markdown, setMarkdown] = useState("")

    useEffect(() => {
        fetch("./CHANGELOG.md")
            .then((r) => r.text())
            .then(text => {
                const converter = new showdown.Converter()
                setMarkdown(converter.makeHtml(text))
            })
    })

    return (
        <div className="container" dangerouslySetInnerHTML={{ __html: markdown }}>
        </div>
    )
}

export default About;