addEventListener('fetch', event => {
  event.respondWith(fetchAndApply(event.request))
})

async function fetchAndApply(request) {
  const name = 'experiment-0'
  let group          // 'control' or 'test', set below
  let isNew = false  // is the group newly-assigned?

  // Determine which group this request is in.
  const cookie = request.headers.get('Cookie')
  if (cookie && cookie.includes(`${name}=v1`)) {
    group = 'v1'
  } else if (cookie && cookie.includes(`${name}=v2`)) {
    group = 'v2'
  } else {
    // 50/50 Split
    group = Math.random() < 0.5 ? 'v1' : 'v2'
    isNew = true
  }


  let url = new URL(request.url)

  url.pathname = `/${group}`

  request = new Request(url, request)

  let response = await fetch(request)

  if (isNew) {

    response = new Response(response.body, response)
    response.headers.append('Set-Cookie', `${name}=${group}; path=/`)
  }

  return response
}