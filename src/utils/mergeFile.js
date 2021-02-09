import diff3Merge from 'diff3'

const LINEBREAKS = /^.*(\r?\n|$)/gm

export function mergeFile({
  ourContent,
  baseContent,
  theirContent,
  ourName = 'ours',
  baseName = 'base',
  theirName = 'theirs',
  format = 'diff',
  markerSize = 7,
}) {
  const ours = ourContent.match(LINEBREAKS)
  const base = baseContent.match(LINEBREAKS)
  const theirs = theirContent.match(LINEBREAKS)

  // Here we let the diff3 library do the heavy lifting.
  const result = diff3Merge(ours, base, theirs)

  // Here we note whether there are conflicts and format the results
  let mergedText = ''
  let cleanMerge = true
  for (const item of result) {
    if (item.ok) {
      mergedText += item.ok.join('')
    }
    if (item.conflict) {
      cleanMerge = false
      mergedText += `> Start of conflict. These are the changes you did here:\n`
      mergedText += item.conflict.a.join('')
      mergedText += `> These are the changes you did elsewhere:\n`
      mergedText += item.conflict.b.join('')
      mergedText += `> End of conflict\n`
    }
  }
  return { cleanMerge, mergedText }
}
