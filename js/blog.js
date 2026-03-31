const btnCreatePost = document.getElementById('btnCreatePost')
const btnShowStats = document.getElementById('btnShowStats')
const formWrapper = document.querySelector('.form-collapse-wrapper')
const btnCancel = document.getElementById('btnCancel')
const addPostForm = document.getElementById('addPostForm')

const statsDialog = document.getElementById('statsDialog')
const closeDialogBtn = document.getElementById('closeDialog')
const postCountSpan = document.getElementById('postCount')

const articlesGrid = document.querySelector('.articles-grid')
const postTemplate = document.getElementById('postTemplate')
const formSection = document.getElementById('formSection')
const mainContent = document.querySelector('main')

// Функция для генерации элемента поста
function createPostElement(data) {
	const clone = postTemplate.content.cloneNode(true)

	clone.querySelector('.tmpl-title').textContent = data.title
	clone.querySelector('.tmpl-text').textContent = data.text
	clone.querySelector('.tmpl-date').textContent = data.date
	clone.querySelector('.tmpl-img').src = data.img
	clone.querySelector('.tmpl-img').alt = data.title

	return clone
}

// Скрытие и раскрытие формы с анимацией

// Раскрыть форму по кнопке
btnCreatePost.addEventListener('click', () => {
	formWrapper.classList.add('open')
	setTimeout(() => {
		if (formSection) {
			formSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	}, 50)
})

// Скрыть форму по кнопке "Отмена"
btnCancel.addEventListener('click', () => {
	formWrapper.classList.remove('open')
	addPostForm.reset()
})

// Подсчет постов и диалоговое окно

// Показать статистику
btnShowStats.addEventListener('click', () => {
	const articleCount = document.querySelectorAll('main article').length
	postCountSpan.textContent = articleCount
	statsDialog.showModal()
})

// Закрытие по крестику
closeDialogBtn.addEventListener('click', () => {
	statsDialog.close()
})

// Закрытие при клике на подложку
statsDialog.addEventListener('click', event => {
	if (event.target === statsDialog) {
		statsDialog.close()
	}
})

// Добавление поста с данными из формы

addPostForm.addEventListener('submit', event => {
	event.preventDefault()

	const imageUrlInput = document.getElementById('imageUrl')

	const postData = {
		title: document.getElementById('header').value,
		text: document.getElementById('text').value,
		date: new Date().toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}),
		img:
			imageUrlInput && imageUrlInput.value
				? imageUrlInput.value
				: 'assets/rickroll.jpg',
	}

	// Создаем новый пост и добавляем его в начало сетки
	const clone = createPostElement(postData)
	articlesGrid.prepend(clone)

	formWrapper.classList.remove('open')
	addPostForm.reset()
})

// Удаление статьи

mainContent.addEventListener('click', event => {
	const deleteBtn = event.target.closest('.delete-btn')
	if (deleteBtn) {
		event.preventDefault()
		const articleCard = deleteBtn.closest('article')

		if (articleCard) {
			articleCard.remove()
		}
	}
})
