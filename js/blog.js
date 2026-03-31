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

const articlesGrid = document.querySelector('.articles-grid')
const postTemplate = document.getElementById('postTemplate')
const formSection = document.getElementById('formSection')
const mainContent = document.querySelector('main')
const emptyState = document.getElementById('emptyState')

// Отрисовка постов
function render() {
	articlesGrid.innerHTML = ''

	if (blogData.posts.length === 0) {
		emptyState.style.display = 'block'
	} else {
		emptyState.style.display = 'none'
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

// Добавление поста с данными из формы

addPostForm.addEventListener('submit', event => {
	event.preventDefault()

	const title = document.getElementById('header').value
	const text = document.getElementById('text').value
	const img = document.getElementById('imageUrl').value

	const newPostData = blogData.shapePostObj(title, text, img)
	blogData.addPost(newPostData)
	render()

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
			blogData.deletePost(articleCard.dataset.id)
			render()
		}
	}
})

render()
