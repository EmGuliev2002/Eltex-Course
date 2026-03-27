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
	const mainContent = document.querySelector('main')

	const featuredArticleSection = document.querySelector('.featured-article')
	const featuredPostTemplate = document.getElementById('featuredPostTemplate')

	// Скрытие и раскрытие формы с анимацией

	btnCreatePost.addEventListener('click', () => {
		formWrapper.classList.add('open')
		setTimeout(() => {
			if (formSection) {
				formSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
			}
		}, 50)
	})

	btnCancel.addEventListener('click', () => {
		formWrapper.classList.remove('open')
		addPostForm.reset()
	})

	// Подсчет постов и диалоговое окно

	btnShowStats.addEventListener('click', () => {
		const articleCount = document.querySelectorAll('main article').length
		postCountSpan.textContent = articleCount
		statsDialog.showModal()
	})

	closeDialogBtn.addEventListener('click', () => {
		statsDialog.close()
	})

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

		// Проверяем, есть ли сейчас главная статья
		const existingFeatured =
			featuredArticleSection.querySelector('.featured-card')

		if (!existingFeatured) {
			// Если главной статьи нет, создаем её из шаблона
			const clone = featuredPostTemplate.content.cloneNode(true)

			clone.querySelector('.tmpl-title').textContent = postData.title
			clone.querySelector('.tmpl-text').textContent = postData.text
			clone.querySelector('.tmpl-date').textContent = postData.date
			clone.querySelector('.tmpl-img').src = postData.img
			clone.querySelector('.tmpl-img').alt = postData.title

			featuredArticleSection.appendChild(clone)
			featuredArticleSection.style.display = 'block' 
		} else {
			// Если главная статья есть, создаем обычную карточку для сетки
			const clone = postTemplate.content.cloneNode(true)

			clone.querySelector('.tmpl-title').textContent = postData.title
			clone.querySelector('.tmpl-text').textContent = postData.text
			clone.querySelector('.tmpl-date').textContent = postData.date
			clone.querySelector('.tmpl-img').src = postData.img
			clone.querySelector('.tmpl-img').alt = postData.title

			articlesGrid.prepend(clone)
		}

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
				if (articleCard.classList.contains('featured-card')) {
					articleCard.closest('.featured-article').style.display = 'none'
				}
				articleCard.remove()
			}
		}
	})
})
