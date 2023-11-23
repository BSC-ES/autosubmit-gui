import React, { useEffect, useState } from 'react';
import { latestNewsLabel } from "../context/vars"
import showdown from 'showdown'

const News = () => {
  const [markdown, setMarkdown] = useState("")

  useEffect(() => {
    fetch("./CHANGELOG.md")
      .then((r) => r.text())
      .then(text => {
        const converter = new showdown.Converter()
        setMarkdown(converter.makeHtml(text))
      })
  })

  localStorage.setItem(latestNewsLabel, true);

  return (
    <div className="container" dangerouslySetInnerHTML={{ __html: markdown }}>
    </div>
  )
}

export default News
