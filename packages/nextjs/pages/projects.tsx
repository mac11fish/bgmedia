import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { DateTime } from "luxon";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import { useCohortWithdrawEvents } from "~~/hooks/useCohortWithdrawEvents";

const projects = [
  {
    name: "Hacked Wallet Recovery",
    description:
      "We built this to make it super easy for victims of hacks to recover any remaining assets in their wallet without getting swept by the attacker.",
    link: "https://hackedwalletrecovery.com",
    github: "https://github.com/BuidlGuidl/flashbot-recovery-bundler",
  },
  {
    name: "Impact Calculator",
    description:
      "This was a prototype that was built to facilitate the needs of Optimism in helping them figure out a new impact-led direction in their RetroPGF rounds.",
    link: "https://impact-calculator.vercel.app",
    github: "https://github.com/BuidlGuidl/impact-calculator",
  },
];

const githubApiUri = "https://api.github.com/repos";

const Projects: NextPage = () => {
  const { data: allWithdrawEvents, isLoading: isWithdrawEventsLoading } = useCohortWithdrawEvents();

  type LastUpdateType = {
    [key: string]: string;
  };

  const [projectsLastUpdate, setProjectsLastUpdate] = useState<LastUpdateType>({});

  useEffect(() => {
    const getLastCommits = async () => {
      const projectsUpdate: LastUpdateType = {};
      for (let i = 0; i < projects.length; i++) {
        const github: string = projects[i].github;
        const owner: string = github.split("/")[3];
        const name: string = github.split("/")[4];
        const apiUrl = `${githubApiUri}/${owner}/${name}`;
        try {
          const result = await fetch(apiUrl);
          const data = await result.json();
          projectsUpdate[github] = data.pushed_at;
        } catch (e) {
          console.error("Error getting repository data: ", apiUrl, e);
        }
      }
      setProjectsLastUpdate(projectsUpdate);
    };
    getLastCommits();
  }, []);

  return (
    <>
      <div className="max-w-3xl px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-primary-content bg-primary inline-block p-2">Projects</h1>
        <div className="mb-16">
          {projects.map(project => {
            return (
              <div className="mb-8" key={project.name}>
                <h2 className="font-bold text-secondary mb-1">
                  {project.name}
                  {projectsLastUpdate[project.github] && (
                    <small className="ml-2 text-gray-500">
                      - Updated {DateTime.fromISO(projectsLastUpdate[project.github]).toRelative()}
                    </small>
                  )}
                </h2>

                <p className="mt-2 mb-0">{project.description}</p>
                <div className="flex gap-2">
                  <Link href={project.github} className="link link-primary text-sm" target="_blank">
                    Github
                  </Link>
                  {project.link && (
                    <Link href={project.link} className="link link-primary text-sm" target="_blank">
                      Live URL
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <h2 className="font-bold mb-2 text-xl text-secondary">Recent Contributions</h2>
        {isWithdrawEventsLoading ? (
          <div className="m-10">
            <div className="text-5xl animate-bounce mb-2">👾</div>
            <div className="text-lg loading-dots">Loading...</div>
          </div>
        ) : (
          <>
            {allWithdrawEvents?.length === 0 && (
              <div className="my-2">
                <p>No contributions yet!</p>
              </div>
            )}
            {allWithdrawEvents?.map((event: any) => {
              return (
                <div
                  className="flex flex-col gap-1 mb-6"
                  key={`${event.builder}_${event.timestamp}`}
                  data-test={`${event.builderAddress}_${event.timestamp}`}
                >
                  <div>
                    <Address address={event.builder} />
                  </div>
                  <div>
                    <strong>{new Date(event.timestamp * 1000).toISOString().split("T")[0]}</strong>
                  </div>
                  <div>
                    Ξ {event.amount} / {event.reason}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default Projects;
