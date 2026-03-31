import { Post } from './Post.js'
import { blogData } from './BlogData.js'

const btnCreatePost = document.getElementById('btnCreatePost')
const btnShowStats = document.getElementById('btnShowStats')
const formWrapper = document.querySelector('.form-collapse-wrapper')
const btnCancel = document.getElementById('btnCancel')
const addPostForm = document.getElementById('addPostForm')

const statsDialog = document.getElementById('statsDialog')
const closeDialogBtn = document.getElementById('closeDialog')
const postCountSpan = document.getElementById('postCount')
const btnReset = document.getElementById('btnReset')

const articlesGrid = document.querySelector('.articles-grid')
const postTemplate = document.getElementById('postTemplate')
const formSection = document.getElementById('formSection')
const mainContent = document.querySelector('main')
const emptyState = document.getElementById('emptyState')
const pagination = document.querySelector('.pagination')

// Создание элемента лоадера
function createLoader() {
	const loader = document.createElement('div')
	loader.className = 'loader'
	loader.innerHTML = `
		<div class="loader-dots">
			<span></span>
			<span></span>
			<span></span>
		</div>
		<p>Загрузка статей...</p>
	`
	return loader
}

// Показать лоадер
function showLoader() {
	const existingLoader = document.querySelector('.loader')
	if (existingLoader) return

	const loader = createLoader()
	articlesGrid.style.display = 'none'
	emptyState.style.display = 'none'
	articlesGrid.parentNode.insertBefore(loader, articlesGrid)
}

// Скрыть лоадер
function hideLoader() {
	const loader = document.querySelector('.loader')
	if (loader) {
		loader.remove()
	}
	articlesGrid.style.display = 'grid'
}

// Флаг для отслеживания выполнения асинхронной операции
let isOperationInProgress = false

// Блокировка элементов управления
function disableControls() {
	isOperationInProgress = true

	btnCreatePost.disabled = true
	btnShowStats.disabled = true
	btnReset.disabled = true
	btnCreatePost.style.opacity = '0.5'
	btnShowStats.style.opacity = '0.5'
	btnReset.style.opacity = '0.5'
	btnCreatePost.style.cursor = 'not-allowed'
	btnShowStats.style.cursor = 'not-allowed'
	btnReset.style.cursor = 'not-allowed'

	const formInputs = addPostForm.querySelectorAll('input, textarea, button')
	formInputs.forEach(input => {
		input.disabled = true
		input.style.opacity = '0.5'
		input.style.cursor = 'not-allowed'
	})
}

// Разблокировка элементов управления
function enableControls() {
	isOperationInProgress = false

	btnCreatePost.disabled = false
	btnShowStats.disabled = false
	btnReset.disabled = false
	btnCreatePost.style.opacity = '1'
	btnShowStats.style.opacity = '1'
	btnReset.style.opacity = '1'
	btnCreatePost.style.cursor = 'pointer'
	btnShowStats.style.cursor = 'pointer'
	btnReset.style.cursor = 'pointer'

	const formInputs = addPostForm.querySelectorAll('input, textarea, button')
	formInputs.forEach(input => {
		input.disabled = false
		input.style.opacity = '1'
		input.style.cursor = ''
	})
}

// Отрисовка постов
async function render(showLoaderFlag = true) {
	if (showLoaderFlag) {
		showLoader()
		// Имитация задержки загрузки
		await new Promise(resolve => setTimeout(resolve, 600))
	}

	articlesGrid.innerHTML = ''

	if (blogData.posts.length === 0) {
		emptyState.style.display = 'block'
		pagination.style.display = 'none'
	} else {
		emptyState.style.display = 'none'
		pagination.style.display = 'flex'
		blogData.posts.forEach(item => {
			const postInstance = new Post(
				item.id,
				item.title,
				item.text,
				item.date,
				item.img,
			)
			articlesGrid.appendChild(postInstance.createHtml())
		})
	}

	if (showLoaderFlag) {
		hideLoader()
	}
}

// Скрытие и раскрытие формы с анимацией

// Раскрыть форму по кнопке
btnCreatePost.addEventListener('click', () => {
	if (isOperationInProgress) return
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
	if (isOperationInProgress) return
	postCountSpan.textContent = blogData.posts.length
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

// Обработчик сброса статей
btnReset?.addEventListener('click', async () => {
	if (isOperationInProgress) return

	if (confirm('Сбросить список к начальным фильмам?')) {
		disableControls()
		statsDialog.close()

		blogData.resetToDefault()
		render(true)

		enableControls()
	}
})

// Добавление поста с данными из формы
addPostForm.addEventListener('submit', async event => {
	event.preventDefault()

	if (isOperationInProgress) return

	disableControls()

	const title = document.getElementById('header').value
	const text = document.getElementById('text').value
	const img = document.getElementById('imageUrl').value

	const newPostData = blogData.shapePostObj(title, text, img)
	blogData.addPost(newPostData)
	render(true)

	formWrapper.classList.remove('open')
	addPostForm.reset()

	enableControls()
})

// Удаление статьи
mainContent.addEventListener('click', event => {
	const deleteBtn = event.target.closest('.delete-btn')
	if (deleteBtn) {
		if (isOperationInProgress) return

		event.preventDefault()
		const articleCard = deleteBtn.closest('article')

		if (articleCard) {
			disableControls()

			blogData.deletePost(articleCard.dataset.id)
			render(false)

			enableControls()
		}
	}
})

// Первоначальная загрузка с лоадером
render(true)
