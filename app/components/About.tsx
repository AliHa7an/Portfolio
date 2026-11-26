import SectionHeader from "./SectionHeader";

const areas = [
  {
    title: "Full stack engineering",
    body: "React, Next.js, NestJS, Node and React Native, in modular codebases other people can pick up.",
  },
  {
    title: "AI in production",
    body: "AI agents, Vapi voice assistants, OpenAI chatbots and automated workflows that move a metric.",
  },
  {
    title: "Cloud architecture",
    body: "Microservices on AWS and Azure, with CI/CD that ships a release in under 15 minutes.",
  },
  {
    title: "Data and APIs",
    body: "PostgreSQL, MongoDB and Redis behind GraphQL and REST, with schemas tuned for read-heavy load.",
  },
  {
    title: "Enterprise sign-in",
    body: "Auth0 and Azure AD single sign-on, OAuth 2.0 and JWT, hardened against the OWASP top 10.",
  },
  {
    title: "Mobile",
    body: "React Native apps for iOS and Android with in-app subscriptions, released through TestFlight and Play Console.",
  },
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container-x">
        <SectionHeader
          title="I take a product from the first diagram to the cloud it runs on."
          description="I design the system, build the interface and own the deployment. I lead distributed teams, and I care more about features customers use than features that demo well."
        />

        <div className="grid gap-12 lg:grid-cols-12">
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-8">
            {areas.map((a) => (
              <div key={a.title} className="rise border-t-[3px] border-fg pt-4">
                <dt className="font-display text-xl font-bold tracking-tight">{a.title}</dt>
                <dd className="mt-2 text-fg-soft">{a.body}</dd>
              </div>
            ))}
          </dl>

          <aside className="lg:col-span-4">
            <div className="raised rounded-3xl p-7">
              <p className="font-display text-2xl font-bold leading-tight tracking-tight">
                Seven years, six companies, eleven shipped products, clients on four continents.
              </p>
              <dl className="mt-6 border-t border-line pt-5">
                <dt className="text-sm text-muted">Education</dt>
                <dd className="mt-1 font-medium">BS Computer Science</dd>
                <dd className="text-fg-soft">Quaid-i-Azam University, Islamabad, 2016 to 2020</dd>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
