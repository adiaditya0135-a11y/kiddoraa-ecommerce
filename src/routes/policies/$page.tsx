import { createFileRoute, notFound } from '@tanstack/react-router'
import { policies } from '@/data/content'

export const Route = createFileRoute('/policies/$page')({
  loader: ({ params }) => {
    const policy = policies[params.page]
    if (!policy) throw notFound()
    return policy
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.title ?? 'Policy'} | Kiddoraa` }] }),
  component: Policy,
})

function Policy() {
  const policy = Route.useLoaderData()
  return (
    <article className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold">{policy.title}</h1>
      <div className="mt-8 space-y-4 text-ink/80 leading-relaxed">
        {policy.body.map((p) => <p key={p}>{p}</p>)}
      </div>
    </article>
  )
}
