export default ({ LOGOUT_ENDPOINT }) => () =>
  fetch(LOGOUT_ENDPOINT, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  }).then(res => console.log(res))
