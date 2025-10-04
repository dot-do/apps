import { defineConfig, defineCollection, s } from 'velite'

const apps = defineCollection({
  name: 'App',
  pattern: 'apps/**/*.mdx',
  schema: s.object({
    title: s.string(),
    slug: s.path(),
    description: s.string(),
    platform: s.enum(['web', 'mobile', 'desktop', 'cli', 'api']).optional(),
    url: s.string().url().optional(),
    type: s.string().optional(), // e.g., 'SaaS', 'marketplace', 'productivity', 'CMS'
    techStack: s.array(s.string()).default([]),
    collections: s.array(s.string()).default([]), // Database collections this app manages
    basepath: s.string().default('/admin'), // URL path prefix (e.g., '/' or '/admin')
    features: s.array(s.string()).default([]),
    metadata: s.object({
      ns: s.string().default('app'),
      visibility: s.enum(['public', 'private', 'unlisted']).default('public')
    }).default({}),
    tags: s.array(s.string()).default([]),
    content: s.mdx()
  }).transform(data => ({
    ...data,
    url: data.url || `/apps/${data.slug}`
  }))
})

export default defineConfig({
  root: '.',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true
  },
  collections: {
    apps
  },
  mdx: {
    rehypePlugins: [],
    remarkPlugins: []
  }
})
