export class Post {
	constructor(id, title, text, date, img) {
		this.id = id
		this.title = title
		this.text = text
		this.date = date
		this.img = img
	}

	createHtml() {
		const postTemplate = document.getElementById('postTemplate')
		const clone = postTemplate.content.cloneNode(true)
		const article = clone.querySelector('article')
		article.dataset.id = this.id
		clone.querySelector('.tmpl-title').textContent = this.title
		clone.querySelector('.tmpl-text').textContent = this.text
		clone.querySelector('.tmpl-date').textContent = this.date
		clone.querySelector('.tmpl-img').src = this.img
		clone.querySelector('.tmpl-img').alt = this.title
		return clone
	}
}
