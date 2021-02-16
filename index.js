//宣告變數
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const USER_PER_PAGE = 18
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const pagination = document.querySelector('#pagination')
const me = document.querySelector('#me')
const users = []
let filteredUser = []

//渲染網頁
function showUserCard(items) {
  let rawHTML = ''
  items.forEach((item) => {
    rawHTML += `
      <div class="col-sm">
        <div class="card mt-5" style="width: 10rem;">
          <img src="${item.avatar}" class="card-img-top" alt="user-avatar">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
          </div>
          <div class="card-footer text-muted">
            <button type="button" class="btn btn-info" data-toggle="modal" data-target="#user-info" data-id="${item.id}">info
            </button>
            <i class="far fa-heart" data-toggle="modal" data-target="#user-favorite" data-id="${item.id}" id="${item.id}heart-btn"></i>
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

//新增我的最愛名單
function addFavoriteUser(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUser')) || []
  const user = users[0].find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('已經在清單內囉～')
  }
  alert('已新增旅伴！')
  list.push(user)
  const heartBtn = document.getElementById(id + 'heart-btn')
  heartBtn.className = 'fas fa-heart'
  localStorage.setItem('favoriteUser', JSON.stringify(list))
}

//判斷是否已經在localStorage
function heartClicked(id) {
  if (users[0].find((user) => user.id === id)) {
    const heartBtn = document.getElementById(id + 'heart-btn')
    heartBtn.className = 'fas fa-heart'
  }
}

//點擊按鈕監聽事件
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-info')) {
    showModalCard(Number(event.target.dataset.id))

  } else if (event.target.matches('.fa-heart')) {
    addFavoriteUser(Number(event.target.dataset.id))
  }
})

// 切割分頁
function getUserbyPage(page) {
  const data = filteredUser.length ? filteredUser : users[0]
  const startIndex = (page - 1) * USER_PER_PAGE
  return data.slice(startIndex, startIndex + USER_PER_PAGE)
}

// 計算分頁數量
function renderPagination(amount) {
  const pageNumber = Math.ceil(amount / USER_PER_PAGE)
  let pageHTML = ''
  for (let page = 1; page <= pageNumber; page++) {
    pageHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page ="${page}">${page}</a></li>
    `
  }
  pagination.innerHTML = pageHTML
}

//SEARCH BAR
searchForm.addEventListener('submit', function onSearchFormButton(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  if (!keyword) {
    return alert('請輸入字串！')
  }
  filteredUser = users[0].filter((user) => user.name.toLowerCase().includes(keyword))
  renderPagination(filteredUser.length)
  showUserCard(getUserbyPage(1))
})

pagination.addEventListener('click', function onPaginatorClick(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  showUserCard(getUserbyPage(page))
})

me.addEventListener('click', function me(e) {
  alert('Hi~~ ')
})

axios.get(INDEX_URL)
  .then((res) => {
    users.push(res.data.results)
    renderPagination(users[0].length)
    showUserCard(getUserbyPage(1))
    const list = JSON.parse(localStorage.getItem('favoriteUser')) || []
    for (let i = 0; i < list.length; i++) {
      heartClicked(list[i].id)
    }
  })
  .catch((err) => {
    console.log(err)
  })