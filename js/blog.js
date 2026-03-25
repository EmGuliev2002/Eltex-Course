document.addEventListener('DOMContentLoaded', () => {
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

	// Скрытие и раскрытие формы с анимацией

	// Раскрыть форму по кнопке
	btnCreatePost.addEventListener('click', () => {
        formWrapper.classList.add('open')
		setTimeout(() => {
			formSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
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

	// Закрытие при клике вне области диалога
	statsDialog.addEventListener('click', event => {
		const rect = statsDialog.getBoundingClientRect()
		if (
			event.clientX < rect.left ||
			event.clientX > rect.right ||
			event.clientY < rect.top ||
			event.clientY > rect.bottom
		) {
			statsDialog.close()
		}
	})

	// Добавление поста с мок-данными

	addPostForm.addEventListener('submit', event => {
		event.preventDefault()

		const mockData = {
			title: 'Новый фильм (Мок-данные)',
			text: 'Здесь должен быть текст статьи, но пока что его нет :с',
			date: new Date().toLocaleDateString('ru-RU', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			}),
			img: 'assets/photo.png', 
		}

		const clone = postTemplate.content.cloneNode(true)

		clone.querySelector('.tmpl-title').textContent = mockData.title
		clone.querySelector('.tmpl-text').textContent = mockData.text
		clone.querySelector('.tmpl-date').textContent = mockData.date
		clone.querySelector('.tmpl-img').src = mockData.img
		clone.querySelector('.tmpl-img').alt = mockData.title

		articlesGrid.prepend(clone)
		formWrapper.classList.remove('open')
		addPostForm.reset()
	})
})
