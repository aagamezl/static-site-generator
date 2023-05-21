let frontmatter = {}
let editor

const addTag = () => {
  const tagElement = $('#tag')
  const tagValue = tagElement.val()

  if (!tagValue) {
    return
  }

  $('.tag-list').append(createBadge(tagValue))

  if (!Array.isArray(frontmatter.tags)) {
    frontmatter.tags = []
  }

  frontmatter.tags.push(tagValue)

  saveFrontmatter('ssg-frontmatter', frontmatter)

  tagElement.val('')
}

const createBadge = (text) => {
  return $('<span />', {
    class: 'badge bg-primary',
    text
  })
}

const toggleFrontmatter = () => {
  $('.frontmatter').toggle()
}

const createIcon = (settings, callback) => {
  settings.class = `fa ${settings.class}`

  const icon = $('<a/>', settings).on('click', callback)

  $('.fa-arrows-alt').after(icon)
}

const saveDocument = () => {
  $.ajax({
    url: `${document.URL}save`,
    method: 'POST',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({
      frontmatter,
      content: editor.value()
    })
  }).done(function (msg) {
    $('#log').html(msg)
  }).fail(function (jqXHR, textStatus) {
    alert('Request failed: ' + textStatus)
  })
}

const saveFrontmatter = (key, frontmatter) => {
  localStorage.setItem(key, JSON.stringify(frontmatter))
}

const getFrontmatter = (key) => {
  return JSON.parse(localStorage.getItem(key) || '{}')
}

const createEditor = () => {
  return new SimpleMDE({
    autosave: {
      enabled: true,
      uniqueId: 'MyUniqueID',
      delay: 1000
    },
    element: document.getElementById('markdown-editor'),
    showIcons: ['code', 'clean-block', 'horizontal-rule', 'strikethrough', 'table'],
    spellChecker: true,
    status: ['autosave', 'lines', 'words', 'cursor', {
      className: 'keystrokes',
      defaultValue: function (el) {
        this.keystrokes = 0;
        el.innerHTML = '0 Keystrokes';
      },
      onUpdate: function (el) {
        el.innerHTML = ++this.keystrokes + ' Keystrokes';
      }
    }], // Another optional usage, with a custom status bar item that counts keystrokes
  })
}

const init = () => {
  editor = createEditor()
  frontmatter = getFrontmatter('ssg-frontmatter')

  for (const [name, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      value.forEach(item => {
        $('.tag-list').append(createBadge(item))
      })
    }

    const input = $(`[name='${name}']`)

    if (input.attr('role') === 'switch') {
      input.prop('checked', value)

      continue
    }

    input.val(value)
  }

  createIcon({
    class: 'fa-save',
    title: 'Save document',
    tabIndex: '-1'
  }, saveDocument)

  createIcon({
    class: 'fa-cogs',
    title: 'Show/Hide Front Matter',
    tabIndex: '-1'
  }, toggleFrontmatter)

  // $('[name='addTag']').on('click', addTag)

  $('input, textarea').on('input', (event) => {
    if (!event.currentTarget.name) {
      return
    }

    if ($(event.currentTarget).attr('type') === 'checkbox') {
      frontmatter[event.currentTarget.name] = $(event.currentTarget).prop('checked')
    } else {
      frontmatter[event.currentTarget.name] = event.currentTarget.value
    }

    saveFrontmatter('ssg-frontmatter', frontmatter)
  })

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  // Loop over them and prevent submission
  $('.needs-validation').each((index, form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault()

      if (!form.checkValidity()) {
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
}

init()
