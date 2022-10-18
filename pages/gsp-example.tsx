import { graph } from "@lib/graph";
import { fetchReposQuery } from "@lib/queries";

import type { NextPage } from "next";

const Home: NextPage = ({ repos }) => {
  return (
    <div className="flex flex-col w-full h-full items-center pt-6">
      <h1 className="text-2xl text-cyan-600">
        Let's start working with some Github
      </h1>

      <div className="flex flex-col gap-4 w-1/2 justify-center mt-6">
        {repos.map((repo) => (
          <article
            key={repo.name}
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

export async function getStaticProps() {
  const netlify = require("@netlify/functions");
  const { token, error } = netlify.getNetlifyGraphTokenForBuild();
  const data = await graph(fetchReposQuery, null, token);

  return {
    props: {
      repos: data.data.gitHub.repositoryOwner.repositories.nodes,
    },
  };
}

export default Home;
