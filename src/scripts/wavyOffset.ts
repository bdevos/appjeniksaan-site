window.addEventListener('scroll', () => {
  const offset = window.pageYOffset
  const element = document.getElementById('wavy')

  if (element) {
    element.style.setProperty(
      '--offset',
      `${offset <= -100 ? -200 : (offset % 100) - 100}%`
    )
  }
})
