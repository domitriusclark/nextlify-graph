import React from "react";
import type { NextPage } from "next";

const CsrExample: NextPage = () => {
  const [repos, setRepos] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/fetchRepos")
      .then((res) => res.json())
      .then((data) =>
        setRepos(data.data.gitHub.repositoryOwner.repositories.nodes)
      );
  }, [repos]);

  return (
    <div className="flex flex-col w-full h-full items-center pt-6">
      <h1 className="text-2xl text-cyan-600">
        Lets start working with some Github
      </h1>

      <div className="flex flex-col gap-4 w-1/2 justify-center mt-6">
        {repos &&
          repos.map((repo) => (
            <article
              key={repo.id}
              className="border-slate-600 bg-slate-800 text-white shadow-lg border-2 p-8 rounded-lg w-full"
            >
              <h1 className="text-xl underlined">{repo.name}</h1>
              <p>{repo.description}</p>
            </article>
          ))}
      </div>
    </div>
  );
};

export default CsrExample;
