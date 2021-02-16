//宣告變數
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const users = JSON.parse(localStorage.getItem('favoriteUser'))
console.log(users)
//渲染網頁
function showUserCard(items) {
  let rawHTML = ''
  items.forEach((item) => {
    rawHTML += `
      <div class="col-sm">
        <div class="card mt-5" style="width: 13rem;">
          <img src="${item.avatar}" class="card-img-top" alt="user-avatar">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
          </div>
          <div class="card-footer text-muted">
            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#user-info" data-id="${item.id}">info
            </button>
            <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#user-favorite" data-id="${item.id}">x
            </button>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

//渲染Modal
function showModalCard(id) {
  const modalName = document.querySelector('#modal-name')
  const modalSurname = document.querySelector('#modal-surname')
  const modalGender = document.querySelector('#modal-gender')
  const modalEmail = document.querySelector('#modal-email')
  const modalAvatar = document.querySelector('#modal-avatar')
  const modalBirthdat = document.querySelector('#modal-birthday')

  axios.get(INDEX_URL + id)
    .then((res) => {
      const data = res.data
      console.log(data)
      modalName.innerHTML = `${data.name}`
      modalSurname.innerHTML = `Surname: ${data.surname}`
      modalGender.innerHTML = `Gender : ${data.gender}`
      modalEmail.innerHTML = `Email : ${data.email}`
      modalBirthdat.innerHTML = `Birthdat : ${data.birthday}`
      modalAvatar.innerHTML = `<img src="${data.avatar}" class="card-img-top" alt="user-avatar">`
    })
    .catch((err) => {
      console.log(err)
    })
}

function favoriteRemove(id) {
  if (!users) return
  const userIndex = users.findIndex((user) => user.id === id)
  users.splice(userIndex, 1)
  localStorage.setItem('favoriteUser', JSON.stringify(users))
  showUserCard(users)
}


dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-info')) {
    showModalCard(Number(event.target.dataset.id))

  } else if (event.target.matches('.btn-danger')) {
    favoriteRemove(Number(event.target.dataset.id))
  }


})



searchForm.addEventListener('submit', function onSearchFormButton(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  let filteredUser = []
  if (!keyword) {
    return alert('請輸入字串！')
  }
  filteredUser = users.filter((user) => user.name.toLowerCase().includes(keyword))
  showUserCard(filteredUser)
})

showUserCard(users)