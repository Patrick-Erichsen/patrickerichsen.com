import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { lstat, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as tar from 'tar'
import YAML from 'yaml'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'vendor', 'skills')
const output = join(root, 'public', 'skills', '.well-known', 'agent-skills')
const schema = 'https://schemas.agentskills.io/discovery/0.2.0/schema.json'

const tracked = execFileSync('git', ['-C', source, 'ls-files', '-z', '--', 'skills/'], {
  encoding: 'utf8',
})
  .split('\0')
  .filter(Boolean)

const filesBySkill = new Map()
for (const path of tracked) {
  const parts = path.split('/')
  if (parts.length < 3 || parts[0] !== 'skills') continue
  const name = parts[1]
  const relativePath = parts.slice(2).join('/')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    throw new Error(`Invalid skill directory: ${name}`)
  }
  if (Buffer.byteLength(relativePath) > 100) {
    throw new Error(`Skill path is too long for the archive: ${path}`)
  }
  const file = join(source, path)
  if (!(await lstat(file)).isFile()) {
    throw new Error(`Tracked skill path is not a regular file: ${path}`)
  }
  const files = filesBySkill.get(name) ?? []
  files.push(relativePath)
  filesBySkill.set(name, files)
}

const manifest = []
for (const [name, files] of [...filesBySkill].sort(([a], [b]) => a.localeCompare(b))) {
  if (!files.includes('SKILL.md')) {
    throw new Error(`Missing SKILL.md: ${name}`)
  }
  const sourceDir = join(source, 'skills', name)
  const skillText = await readFile(join(sourceDir, 'SKILL.md'), 'utf8')
  const frontmatter = skillText.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!frontmatter) throw new Error(`Invalid frontmatter: ${name}`)
  const metadata = YAML.parse(frontmatter[1])
  if (
    metadata?.name !== name ||
    typeof metadata.description !== 'string' ||
    !metadata.description
  ) {
    throw new Error(`Invalid skill metadata: ${name}`)
  }
  if (metadata.description.length > 1024) {
    throw new Error(`Skill description is too long: ${name}`)
  }
  if (metadata.metadata?.internal === true) continue
  manifest.push({ name, description: metadata.description, files, sourceDir })
}

if (manifest.length === 0) throw new Error('No public skills found')
await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })

const skills = []
for (const { name, description, files, sourceDir } of manifest) {
  const archiveName = `${name}.tar.gz`
  const archivePath = join(output, archiveName)
  await tar.c(
    {
      file: archivePath,
      cwd: sourceDir,
      gzip: true,
      portable: true,
      noPax: true,
      mtime: new Date(0),
      strict: true,
    },
    files,
  )
  const digest = createHash('sha256')
    .update(await readFile(archivePath))
    .digest('hex')
  skills.push({
    name,
    type: 'archive',
    description,
    url: `./${archiveName}`,
    digest: `sha256:${digest}`,
  })
}

await writeFile(
  join(output, 'index.json'),
  `${JSON.stringify({ $schema: schema, skills }, null, 2)}\n`,
)
console.log(`Published ${skills.length} skills at /skills/.well-known/agent-skills/`)
