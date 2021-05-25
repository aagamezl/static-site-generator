const get = (ctx, path) => {
  path = path.pop ? path : path.split('.')
  ctx = ctx[path.shift()]
  ctx = ctx != null ? ctx : ''

  return (0 in path) ? get(ctx, path) : ctx
}

const blockregex = /([\s\S]*?)({{((\/)|(\^)|#)(.*?)}}|$)/g
const valueregex = /{{{(.*?)}}}|{{(!?)(&?)(>?)(.*?)}}/g

const template = (html, self, parent, invert) => {
  var output = ''
  var i

  self = Array.isArray(self) ? self : (self ? [self] : [])
  self = invert ? ((0 in self) ? [] : [1]) : self

  for (i = 0; i < self.length; i++) {
    let childCode = ''
    let depth = 0
    let inverted
    let ctx = (typeof self[i] === 'object') ? self[i] : {}
    ctx = Object.assign({}, parent, ctx)
    ctx[''] = { '': self[i] }

    html.replace(blockregex, (match, code, y, z, close, invert, name) => {
        if (!depth) {
          output += code.replace(valueregex, (match, raw, comment, isRaw, partial, name) => {
              return raw ? get(ctx, raw)
                : isRaw ? get(ctx, name)
                  : partial ? template(get(ctx, name), ctx)
                    : !comment ? get(ctx, name)
                      : ''
            }
          )
          inverted = invert
        } else {
          childCode += depth && !close || depth > 1 ? match : code
        }

        if (close) {
          if (!--depth) {
            name = get(ctx, name)
            if (/^f/.test(typeof name)) {
              output += name.call(ctx, childCode, function (template) {
                return template(template, ctx)
              })
            } else {
              output += template(childCode, name, ctx, inverted)
            }
            childCode = ''
          }
        } else {
          ++depth
        }
      }
    )
  }

  return output
}

module.exports = {
  template
}
